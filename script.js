
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_EXISTING_API_KEY",
    authDomain: "library-management-syste-bcdbe.firebaseapp.com",
    databaseURL: "https://library-management-syste-bcdbe-default-rtdb.firebaseio.com",
    projectId: "library-management-syste-bcdbe",
    storageBucket: "library-management-syste-bcdbe.firebasestorage.app",
    messagingSenderId: "520942912633",
    appId: "1:5<ACCOUNT_NUMBER>08:web:5d088bf872eb4e3734c0a8",
    measurementId: "G-KGN718SXEL"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const booksRef = ref(db, "books");

let books = [];

function addBook() {
    const name = document.getElementById("bookName").value.trim();
    const author = document.getElementById("author").value.trim();

    if (!name || !author) {
        alert("Please enter book name and author!");
        return;
    }

    const newBookRef = push(booksRef);

    set(newBookRef, { name, author })
        .then(() => {
            document.getElementById("bookName").value = "";
            document.getElementById("author").value = "";
        })
        .catch(error => {
            console.error(error);
            alert("Book add aagala. Realtime Database rules check pannunga.");
        });
}

function displayBooks() {
    const list = document.getElementById("bookList");
    const search = document.getElementById("search").value.toLowerCase();

    list.innerHTML = "";

    books.forEach(book => {
        if ((book.name + " " + book.author).toLowerCase().includes(search)) {
            const li = document.createElement("li");
            li.appendChild(
                document.createTextNode(book.name + " - " + book.author + " ")
            );

            const btn = document.createElement("button");
            btn.textContent = "Delete";
            btn.className = "delete";

            btn.onclick = async () => {
                try {
                    await remove(ref(db, "books/" + book.id));
                } catch (error) {
                    console.error(error);
                    alert("Delete aagala. Database rules check pannunga.");
                }
            };

            li.appendChild(btn);
            list.appendChild(li);
        }
    });
}

onValue(booksRef, snapshot => {
    const data = snapshot.val() || {};

    books = Object.entries(data).map(([id, book]) => ({
        id,
        ...book
    }));

    displayBooks();
}, error => {
    console.error(error);
    alert("Database access problem. Realtime Database rules check pannunga.");
});

window.addBook = addBook;
window.displayBooks = displayBooks;
