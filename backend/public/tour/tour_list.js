function fetchTours() {
  fetch('/api')
    .then(response => response.json())
    .then(data => {
      const tourListElement = document.getElementById('tourListContainer');
      tourListElement.innerHTML = ''; // Limpar o conteúdo anterior, se houver

      const ulElement = document.createElement('ul');
      ulElement.id = 'tourList';

      // Se houver tours, iterar sobre eles e adicionar cada um como um item de lista com um botão
      if (data.tours.length > 0) {
        data.tours.forEach(tour => {
          const listItem = document.createElement('li');
          const tourButton = document.createElement('button');
          tourButton.textContent = tour.name;
          tourButton.addEventListener('click', () => {
            window.location.href = `/${tour._id}`; // Redirecionar para a rota do tour com o ID específico
          });
          listItem.appendChild(tourButton);
          ulElement.appendChild(listItem);
        });
      }

      // Adicionar a lista de tours ao elemento pai
      tourListElement.appendChild(ulElement);

      // Exibir o botão "Criar Tour"
      const createTourButton = document.createElement('button');
      createTourButton.textContent = 'Criar Tour';
      createTourButton.addEventListener('click', () => {
        window.location.href = '/'; // Redirecionar para a página de criação de tour
      });
      tourListElement.appendChild(createTourButton);
    })
    .catch(error => console.error('Erro ao buscar os tours:', error));
}

// Chamar a função fetchTours() para exibir os tours ao carregar a página
fetchTours();
