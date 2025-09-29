async function loadProjects() {
  try {
    const response = await fetch("js/data.json");
    const data = await response.json();

    const projectsContainer = document.getElementById("projects");

    data.forEach(project => {
      if (project.images && project.images.length > 0) {
        // cria um case por projeto
        const caseDiv = document.createElement("div");
        caseDiv.classList.add("case");

        let currentIndex = 0; // começa na primeira mídia

        function renderMedia(index) {
          caseDiv.innerHTML = ""; // limpa conteúdo
          const mediaSrc = project.images[index];

          if (mediaSrc.includes("vimeo.com")) {
            const iframe = document.createElement("iframe");
            iframe.src = mediaSrc;
            iframe.width = "640";
            iframe.height = "360";
            iframe.frameBorder = "0";
            iframe.allow =
              "autoplay; fullscreen; picture-in-picture; clipboard-write";
            iframe.allowFullscreen = true;
            caseDiv.appendChild(iframe);
          } else {
            const img = document.createElement("img");
            img.src = mediaSrc;
            img.alt = project.project || "Project image";
            caseDiv.appendChild(img);
          }
        }

        // renderiza a primeira
        renderMedia(currentIndex);

        // clique para avançar/retroceder
        // clique para avançar/retroceder
        caseDiv.addEventListener("click", e => {
          const rect = caseDiv.getBoundingClientRect();
          const clickX = e.clientX - rect.left;

          if (clickX > rect.width / 2) {
            // direita -> próximo
            currentIndex = (currentIndex + 1) % project.images.length;
          } else {
            // esquerda -> anterior
            currentIndex =
              (currentIndex - 1 + project.images.length) % project.images.length;
          }

          renderMedia(currentIndex);
        });

        // muda o cursor conforme o lado
        caseDiv.addEventListener("mousemove", e => {
          const rect = caseDiv.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;

          if (mouseX > rect.width / 2) {
            caseDiv.style.cursor = "e-resize"; // seta para direita
          } else {
            caseDiv.style.cursor = "w-resize"; // seta para esquerda
          }
        });

        projectsContainer.appendChild(caseDiv);
      }
    });
  } catch (err) {
    console.error("Erro ao carregar JSON:", err);
  }
}

loadProjects();
