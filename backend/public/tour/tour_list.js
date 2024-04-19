// tour-list.js
// Função para buscar os tours do backend e exibi-los na página
function fetchTours() {
  fetch('/api/tours')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const tourListElement = document.getElementById('tourListContainer');

      // Limpar o conteúdo anterior, se houver
      tourListElement.innerHTML = '';

      // Se não houver tours, exibir o botão "Criar Tour"
      if (data.tours.length === 0) {
        const createTourButton = document.createElement('button');
        createTourButton.textContent = 'Criar Tour';
        createTourButton.addEventListener('click', () => {
          // Redirecionar para a página de criação de tour ou executar a lógica necessária para criar um novo tour
          window.location.href = '/';

        });
        tourListElement.appendChild(createTourButton);
      } else {
        // Criar uma lista não ordenada para os tours
        const ulElement = document.createElement('ul');
        ulElement.id = 'tourList';

        // Iterar sobre os dados dos tours e adicionar cada um como um item de lista
        data.forEach(tour => {
          const listItem = document.createElement('li');
          listItem.textContent = tour.name;
          ulElement.appendChild(listItem);
        });

        // Adicionar a lista de tours ao elemento pai
        tourListElement.appendChild(ulElement);
      }
    })
    .catch(error => console.error('Erro ao buscar os tours:', error));
}

// Chamar a função fetchTours() para exibir os tours ao carregar a página
fetchTours();
