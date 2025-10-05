async function loadProjects() {
  try {
    const response = await fetch("js/data.json");
    const data = await response.json();

    const projectsContainer = document.getElementById("projects");

    for (const project of data) {
      if (project.images && project.images.length > 0) {
        const caseDiv = document.createElement("div");
        caseDiv.classList.add("case");

        // Calcula altura para TODAS as mídias (imagens e vídeos)
        // Adiciona o case ao DOM primeiro para obter a largura real
        projectsContainer.appendChild(caseDiv);
        
        // AGUARDA um frame para garantir que o DOM foi atualizado (fix Safari)
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Agora calcula com a largura REAL do container
        const realContainerWidth = caseDiv.offsetWidth;
        
        const mediaPromises = project.images.map(async (src, index) => {
          if (isVideo(src)) {
            // Para vídeos locais, busca as dimensões
            const height = await getVideoDimensions(src, realContainerWidth);
            console.log(`🎬 [${index}] Vídeo: ${src} -> ${height}px`);
            return height;
          } else {
            // Para imagens normais
            return new Promise(resolve => {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                const scaledHeight = img.naturalHeight * (realContainerWidth / img.naturalWidth);
                console.log(`🖼️ [${index}] Imagem: ${src} -> ${scaledHeight}px`);
                resolve(scaledHeight);
              };
              img.onerror = () => {
                console.warn(`❌ [${index}] Erro ao carregar imagem:`, src);
                resolve(0);
              };
            });
          }
        });

        const heights = await Promise.all(mediaPromises);
        
        console.log('📊 Alturas calculadas:', heights);
        console.log('📊 Número de itens:', project.images.length);
        console.log('📏 Largura real do container:', realContainerWidth);
        
        // Filtra valores inválidos (0 ou NaN)
        const validHeights = heights.filter(h => h > 0);
        
        const maxHeight = validHeights.length > 0 
          ? Math.min(Math.max(...validHeights), window.innerHeight * 0.7)
          : window.innerHeight * 0.5;
        
        caseDiv.style.height = `${maxHeight}px`;
        console.log('📐 Altura final do case:', maxHeight);
        console.log('📐 Maior altura calculada:', Math.max(...validHeights));

        let currentIndex = 0;

        function renderMedia(index) {
          caseDiv.innerHTML = "";
          const mediaSrc = project.images[index];
          let mediaElement;

          if (isVideo(mediaSrc)) {
            // Renderiza vídeo local
            const video = document.createElement("video");
            video.src = mediaSrc;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.controls = false;
            video.setAttribute('playsinline', ''); // Fix Safari iOS
            video.setAttribute('webkit-playsinline', ''); // Fix Safari iOS older
            video.style.width = "100%";
            video.style.height = "100%";
            video.style.objectFit = "contain";
            video.style.pointerEvents = "none";
            video.style.display = "block"; // Fix Safari
            
            // Force play on Safari
            video.addEventListener('loadedmetadata', () => {
              video.play().catch(e => console.warn('Autoplay bloqueado:', e));
            });
            
            mediaElement = video;
            
            console.log('🎬 Vídeo carregado:', mediaSrc);
          } else {
            // Renderiza imagem
            const img = document.createElement("img");
            img.src = mediaSrc;
            img.alt = project.project || "Project image";
            img.setAttribute("loading", "lazy");
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            img.style.display = "block"; // Fix Safari
            mediaElement = img;
          }

          mediaElement.classList.add("fade");
          caseDiv.appendChild(mediaElement);

          requestAnimationFrame(() => {
            mediaElement.classList.add("show");
          });
        }

        // Função auxiliar para verificar se é vídeo
        function isVideo(src) {
          const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
          return videoExtensions.some(ext => src.toLowerCase().includes(ext));
        }

        // Função para obter dimensões do vídeo
        function getVideoDimensions(src, containerWidth) {
          return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'metadata';
            video.muted = true; // Safari precisa disso
            video.playsInline = true; // Safari precisa disso
            
            let resolved = false;
            
            // Timeout de segurança
            const timeout = setTimeout(() => {
              if (!resolved) {
                console.warn('⏱️ Timeout ao carregar vídeo:', src);
                resolved = true;
                resolve(containerWidth * (9/16));
              }
            }, 5000);
            
            video.onloadedmetadata = () => {
              if (!resolved) {
                clearTimeout(timeout);
                resolved = true;
                
                const scaledHeight = video.videoHeight * (containerWidth / video.videoWidth);
                console.log(`📹 Vídeo ${src}: ${video.videoWidth}x${video.videoHeight} -> altura: ${scaledHeight}px`);
                resolve(scaledHeight);
              }
            };
            
            video.onerror = (e) => {
              if (!resolved) {
                clearTimeout(timeout);
                resolved = true;
                console.error('❌ Erro ao carregar vídeo:', src, e);
                resolve(containerWidth * (9/16));
              }
            };
            
            // Safari às vezes precisa de um load() explícito
            video.load();
          });
        }

        renderMedia(currentIndex);

        // Navegação por clique
        caseDiv.addEventListener("click", (e) => {
          const rect = caseDiv.getBoundingClientRect();
          const clickX = e.clientX - rect.left;

          if (clickX > rect.width / 2) {
            currentIndex = (currentIndex + 1) % project.images.length;
          } else {
            currentIndex = (currentIndex - 1 + project.images.length) % project.images.length;
          }

          renderMedia(currentIndex);
        });

        // Cursor visual
        caseDiv.addEventListener("mousemove", e => {
          const rect = caseDiv.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          caseDiv.style.cursor = mouseX > rect.width / 2 ? "e-resize" : "w-resize";
        });

        projectsContainer.appendChild(caseDiv);
        console.log('✅ Case adicionado:', project.project);
      }
    }
  } catch (err) {
    console.error("❌ Erro ao carregar JSON:", err);
  }
}

loadProjects();