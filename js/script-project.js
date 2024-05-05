const c1 = document.getElementById('s2');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const b1 = document.getElementById('btn1');
const b2 = document.getElementById('btn2');
const b3 = document.getElementById('btn3');

b1.addEventListener("click", () => {
    c1.classList.toggle("d-none");
    c2.classList.toggle("d-none");
});

b2.addEventListener("click", () => {
    c2.classList.toggle("d-none");
    c3.classList.toggle("d-none");
});

b3.addEventListener("click", () => {
    c3.classList.toggle("d-none");
    c1.classList.toggle("d-none");
});


(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      } 
      else {
        alert('Thank you for submitting your contact information successfully.');
      }

      form.classList.add('was-validated')
    }, false)
  })
})()