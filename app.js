// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const search = document.getElementById("search");

// search engine

search.addEventListener('keyup', e => {
    let currentValue = e.target.value.toLowerCase();
    let names = document.querySelectorAll('.name');
    names.forEach(name => {
        if (name.textContent.toLocaleLowerCase().includes(currentValue)) {
            name.parentNode.parentNode.style.display = 'flex';
        }else {
            name.parentNode.parentNode.style.display = 'none';
        }
    })
});

// fetch data from API
fetch(urlAPI)
.then(res => res.json())
.then(res => res.results)
.then(displayEmployees)
.catch(err => console.log(err))

function displayEmployees(employeeData) {
    employees = employeeData;
    // store the employee HTML as we create it
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    // template literals make this so much cleaner!
    employeeHTML += `
    <div class="card" data-index="${index}">
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <p class="address">${city}</p>
    </div>
    </div>
    `
    });
    gridContainer.innerHTML = employeeHTML;
}

function displayModal(index) {
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
    <h2 class="name">${name.first} ${name.last}</h2>
    <p class="email">${email}</p>
    <hr />
    <p class="tel">${phone}</p>
    <p class="address">${street.number} ${street.name} <br> ${city}, ${state} ${postcode}</p>
    <p class="birthday">Birthday:
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div> 
    <button class="prev-btn" onclick="prevEmployee(${index})">Previous</button>
    <button class="next-btn" onclick="nextEmployee(${index})">Next</button> 
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
    }

    function prevEmployee(index) {
        if (index > 0) {
          displayModal(index - 1);
        }
      }
      
      function nextEmployee(index) {
        if (index < employees.length - 1) {
          displayModal(index + 1);
        }
      }
      

    gridContainer.addEventListener('click', e => {
        // make sure the click is not on the gridContainer itself
        if (e.target !== gridContainer) {
        // select the card element based on its proximity to actual element clicked
        const card = e.target.closest(".card");
        const index = card.getAttribute('data-index');
        displayModal(index);
        }
        });

        modalClose.addEventListener('click', () => {
            overlay.classList.add("hidden");
            modalContainer.innerHTML = ""; // Clear the modal content
          });
           