document.addEventListener("DOMContentLoaded", () => {
    let form = document.querySelector(".contact-form form");
    let modal = document.createElement("div");

    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <p>Thank you! Your request has been received.</p>
            <button class="close-modal">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        modal.style.display = "flex";
        modal.classList.add("fade-in");
    });

    let closeModal = () => {
        modal.classList.remove("fade-in");
        modal.classList.add("fade-out");
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("fade-out");
        }, 500);
    };

    modal.querySelector(".close-modal").addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
