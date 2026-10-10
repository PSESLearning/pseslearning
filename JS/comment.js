/* =========================================================
   PSES LEARNING
   PUBLIC COMMENTS
   FIREBASE FIRESTORE
   ========================================================= */


/* =========================================================
   FIREBASE IMPORTS
   ========================================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   =========================================================
   
   नीचे अपनी Firebase Console की exact values डालें.
   ========================================================= */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBztlAK-kWu1Shh2SZnZnNzuTvMEgIrhcw",
  authDomain: "pses-learning.firebaseapp.com",
  projectId: "pses-learning",
  storageBucket: "pses-learning.firebasestorage.app",
  messagingSenderId: "19229263270",
  appId: "1:19229263270:web:fab3623ceb3a0d85defb67",
  measurementId: "G-JRLNZR6YJD"
};


/* =========================================================
   FIREBASE INITIALIZE
   ========================================================= */

const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


/* =========================================================
   COMMENTS COLLECTION
   ========================================================= */

const commentsCollection =
    collection(
        db,
        "comments"
    );


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const commentForm =
    document.getElementById(
        "commentForm"
    );


const studentName =
    document.getElementById(
        "studentName"
    );


const chapterSelect =
    document.getElementById(
        "chapterSelect"
    );


const studentComment =
    document.getElementById(
        "studentComment"
    );


const characterCount =
    document.getElementById(
        "characterCount"
    );


const submitBtn =
    document.getElementById(
        "submitBtn"
    );


const submitText =
    document.getElementById(
        "submitText"
    );


const demoFillBtn =
    document.getElementById(
        "demoFill"
    );


const clearFormBtn =
    document.getElementById(
        "clearForm"
    );


const hideCommentsBtn =
    document.getElementById(
        "hideComments"
    );


const showCommentsBtn =
    document.getElementById(
        "showComments"
    );


const commentsContainer =
    document.getElementById(
        "commentsContainer"
    );


const filterRow =
    document.getElementById(
        "filterRow"
    );


const totalCommentsEl =
    document.getElementById(
        "totalComments"
    );


const selectedChapterLabelEl =
    document.getElementById(
        "selectedChapterLabel"
    );


const latestEntryEl =
    document.getElementById(
        "latestEntry"
    );


const listStatusEl =
    document.getElementById(
        "listStatus"
    );


const message =
    document.getElementById(
        "message"
    );


/* =========================================================
   STATE
   ========================================================= */

let allComments = [];

let activeFilter = "all";

let commentsVisible = true;


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function setMessage(
    text,
    type = ""
) {

    message.textContent =
        text;

    message.className =
        "status-message";


    if (type) {

        message.classList.add(
            type
        );

    }

}


/* =========================================================
   CHARACTER COUNT
   ========================================================= */

studentComment.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            `${studentComment.value.length}/1000`;

    }
);


/* =========================================================
   CLEAR FORM
   ========================================================= */

clearFormBtn.addEventListener(
    "click",
    () => {

        commentForm.reset();

        characterCount.textContent =
            "0/1000";

        setMessage();

    }
);


/* =========================================================
   FILL SAMPLE
   ========================================================= */

demoFillBtn.addEventListener(
    "click",
    () => {

        studentName.value =
            "Riya";


        chapterSelect.value =
            "Class 12 - Book 1";


        studentComment.value =
            "Ma'am, please add more material for this book.";


        characterCount.textContent =
            `${studentComment.value.length}/1000`;


        setMessage(
            "Sample information filled. Click Send Comment to post it.",
            "success"
        );

    }
);


/* =========================================================
   HIDE COMMENTS
   ========================================================= */

hideCommentsBtn.addEventListener(
    "click",
    () => {

        commentsVisible =
            false;


        renderComments();

    }
);


/* =========================================================
   SHOW COMMENTS
   ========================================================= */

showCommentsBtn.addEventListener(
    "click",
    () => {

        activeFilter =
            "all";


        filterRow
            .querySelectorAll(
                ".filter-chip"
            )
            .forEach(
                chip => {

                    chip.classList.remove(
                        "active"
                    );

                }
            );


        const allButton =
            filterRow.querySelector(
                '[data-filter="all"]'
            );


        if (allButton) {

            allButton.classList.add(
                "active"
            );

        }


        commentsVisible =
            true;


        renderComments();

    }
);


/* =========================================================
   FILTERS
   ========================================================= */

filterRow
    .querySelectorAll(
        ".filter-chip"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    activeFilter =
                        button.dataset.filter;


                    commentsVisible =
                        true;


                    filterRow
                        .querySelectorAll(
                            ".filter-chip"
                        )
                        .forEach(
                            chip => {

                                chip.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    renderComments();

                }
            );

        }
    );


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatTime(
    timestamp
) {

    if (!timestamp) {

        return "Just now";

    }


    try {

        return timestamp
            .toDate()
            .toLocaleString(
                "en-IN",
                {
                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"
                }
            );

    } catch {

        return "Just now";

    }

}


/* =========================================================
   FILTER COMMENTS
   ========================================================= */

function getFilteredComments() {

    if (
        activeFilter === "all"
    ) {

        return allComments;

    }


    return allComments.filter(
        item =>
            item.chapter ===
            activeFilter
    );

}


/* =========================================================
   UPDATE STATISTICS
   ========================================================= */

function updateStatistics() {

    const filteredComments =
        getFilteredComments();


    totalCommentsEl.textContent =
        allComments.length;


    selectedChapterLabelEl.textContent =
        activeFilter === "all"
            ? "All Comments"
            : activeFilter;


    if (
        allComments.length > 0
    ) {

        latestEntryEl.textContent =
            allComments[0].name ||
            "Anonymous";

    } else {

        latestEntryEl.textContent =
            "-";

    }


    listStatusEl.textContent =
        `Showing ${filteredComments.length} of ${allComments.length} comments`;

}


/* =========================================================
   CREATE COMMENT CARD
   ========================================================= */

function createCommentCard(
    item
) {


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "comment-card";


    /* ================= META ================= */

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "comment-meta";


    /* ================= AUTHOR ================= */

    const author =
        document.createElement(
            "div"
        );


    author.className =
        "comment-author";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "comment-name";


    name.textContent =
        item.name ||
        "Anonymous";


    const time =
        document.createElement(
            "div"
        );


    time.className =
        "comment-time";


    time.textContent =
        formatTime(
            item.createdAt
        );


    author.appendChild(
        name
    );


    author.appendChild(
        time
    );


    /* ================= CHAPTER ================= */

    const chapter =
        document.createElement(
            "span"
        );


    chapter.className =
        "comment-chapter";


    chapter.textContent =
        item.chapter ||
        "General Comment";


    meta.appendChild(
        author
    );


    meta.appendChild(
        chapter
    );


    /* ================= COMMENT ================= */

    const text =
        document.createElement(
            "p"
        );


    text.className =
        "comment-text";


    text.textContent =
        item.comment ||
        "";


    /* ================= CARD ================= */

    card.appendChild(
        meta
    );


    card.appendChild(
        text
    );


    return card;

}


/* =========================================================
   RENDER COMMENTS
   ========================================================= */

function renderComments() {

    commentsContainer.innerHTML =
        "";


    updateStatistics();


    /* ================= HIDDEN ================= */

    if (
        !commentsVisible
    ) {

        const hidden =
            document.createElement(
                "div"
            );


        hidden.className =
            "empty-state";


        hidden.textContent =
            'Comments are hidden. Click "Show all" to display them.';


        commentsContainer.appendChild(
            hidden
        );


        return;

    }


    /* ================= FILTER ================= */

    const filteredComments =
        getFilteredComments();


    /* ================= EMPTY ================= */

    if (
        filteredComments.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        if (
            allComments.length === 0
        ) {

            empty.textContent =
                "No comments yet. Be the first student to share a question or suggestion.";

        } else {

            empty.textContent =
                "No comments are available for this filter.";

        }


        commentsContainer.appendChild(
            empty
        );


        return;

    }


    /* ================= CARDS ================= */

    filteredComments.forEach(
        item => {

            const card =
                createCommentCard(
                    item
                );


            commentsContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   FIRESTORE QUERY
   ========================================================= */

const commentsQuery =
    query(
        commentsCollection,
        orderBy(
            "createdAt",
            "desc"
        )
    );


/* =========================================================
   REAL-TIME FIRESTORE LISTENER
   ========================================================= */

onSnapshot(

    commentsQuery,

    snapshot => {

        allComments = [];


        snapshot.forEach(
            doc => {

                allComments.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        renderComments();

    },


    error => {

        console.error(
            "Firestore error:",
            error
        );


        commentsContainer.innerHTML =
            "";


        const errorBox =
            document.createElement(
                "div"
            );


        errorBox.className =
            "empty-state";


        errorBox.textContent =
            "Comments could not be loaded. Please check your Firebase settings and Firestore Rules.";


        commentsContainer.appendChild(
            errorBox
        );

    }

);


/* =========================================================
   SUBMIT COMMENT
   ========================================================= */

commentForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            studentName.value.trim();


        const chapter =
            chapterSelect.value.trim();


        const comment =
            studentComment.value.trim();


        /* ================= VALIDATION ================= */

        if (
            name.length === 0
        ) {

            setMessage(
                "Please enter your name.",
                "error"
            );

            studentName.focus();

            return;

        }


        if (
            name.length > 50
        ) {

            setMessage(
                "Your name must be 50 characters or less.",
                "error"
            );

            studentName.focus();

            return;

        }


        if (
            comment.length === 0
        ) {

            setMessage(
                "Please write your question or comment.",
                "error"
            );

            studentComment.focus();

            return;

        }


        if (
            comment.length > 1000
        ) {

            setMessage(
                "Your comment must be 1000 characters or less.",
                "error"
            );

            studentComment.focus();

            return;

        }


        /* ================= LOADING ================= */

        submitBtn.disabled =
            true;


        submitText.textContent =
            "Sending...";


        try {


            /* ================= FIRESTORE ================= */

            await addDoc(
                commentsCollection,
                {

                    name:
                        name,

                    chapter:
                        chapter ||
                        "General Comment",

                    comment:
                        comment,

                    createdAt:
                        serverTimestamp()

                }
            );


            /* ================= SUCCESS ================= */

            commentForm.reset();


            characterCount.textContent =
                "0/1000";


            commentsVisible =
                true;


            setMessage(
                "Your comment has been posted successfully.",
                "success"
            );


        } catch (error) {


            console.error(
                "Error adding comment:",
                error
            );


            setMessage(
                "Your comment could not be posted. Please try again.",
                "error"
            );

        } finally {


            submitBtn.disabled =
                false;


            submitText.textContent =
                "Send Comment";

        }

    }
);


/* =========================================================
   INITIAL RENDER
   ========================================================= */

renderComments();