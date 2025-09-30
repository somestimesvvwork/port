async function loadProjects() {
  try {
    const response = await fetch("js/data.json");
    const data = await response.json();

    const projectsContainer = document.getElementById("projects");

    for (const project of data) {
      if (project.images && project.images.length > 0) {
        const caseDiv = document.createElement("div");
        caseDiv.classList.add("case");

        // dentro do loop de cada project
        const imgPromises = project.images
          .filter(src => !src.includes("vimeo.com"))
          .map(src => {
            return new Promise(resolve => {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                const containerWidth = window.innerWidth * 0.95; // width do .case no mobile
                const scaledHeight = img.naturalHeight * (containerWidth / img.naturalWidth);
                resolve(scaledHeight);
              };
              img.onerror = () => resolve(0);
            });
          });

        const heights = await Promise.all(imgPromises);
        const maxHeight = Math.min(Math.max(...heights), window.innerHeight * 0.7);
        caseDiv.style.height = `${maxHeight}px`;


        caseDiv.style.height = `${maxHeight}px`;

        let currentIndex = 0;

        function renderMedia(index) {
          caseDiv.innerHTML = "";
          const mediaSrc = project.images[index];
          let mediaElement;

          if (mediaSrc.includes("vimeo.com")) {
            const iframe = document.createElement("iframe");
            iframe.src = mediaSrc;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            iframe.allow =
              "autoplay; fullscreen; picture-in-picture; clipboard-write";
            iframe.allowFullscreen = true;
            mediaElement = iframe;
          } else {
            const img = document.createElement("img");
            img.src = mediaSrc;
            img.alt = project.project || "Project image";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            mediaElement = img;
          }

          mediaElement.classList.add("fade");
          caseDiv.appendChild(mediaElement);

          requestAnimationFrame(() => {
            mediaElement.classList.add("show");
          });
        }

        renderMedia(currentIndex);

        caseDiv.addEventListener("click", e => {
          const rect = caseDiv.getBoundingClientRect();
          const clickX = e.clientX - rect.left;

          if (clickX > rect.width / 2) {
            currentIndex = (currentIndex + 1) % project.images.length;
          } else {
            currentIndex =
              (currentIndex - 1 + project.images.length) % project.images.length;
          }

          renderMedia(currentIndex);
        });

        caseDiv.addEventListener("mousemove", e => {
          const rect = caseDiv.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          caseDiv.style.cursor = mouseX > rect.width / 2 ? "e-resize" : "w-resize";
        });

        projectsContainer.appendChild(caseDiv);
      }
    }
  } catch (err) {
    console.error("Erro ao carregar JSON:", err);
  }
}

loadProjects();
