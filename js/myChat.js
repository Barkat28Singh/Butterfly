document.addEventListener("DOMContentLoaded", function () {
  // HTML DECLARATIONS

  const listDiv = document.querySelector("#post-list");
  const formDiv = document.getElementById("form");
  const postInputDiv = document.getElementById("postInput");
  const questionDiv = document.getElementById("question");
  const generateBtnDiv = document.getElementById("generateBtn");

  const db = firebase.firestore();

  // EDIT POST

  const editPost = (id, post) => {
    db.collection("Forum Posts")
      .doc(id)
      .update({
        post: post,
      })
      .then(() => {
        console.log("edited successfully");
      })
      .catch(() => {
        console.error("error");
      });
  };

  // DELETE POST

  const deletePost = (id) => {
    db.collection("Forum Posts")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Post deleted successfully");
      })
      .catch((error) => {
        console.log("Error deleting post", error);
      });
  };

  // ADD POST

  const addPost = (post) => {
    db.collection("Forum Posts")
      .add({
        post: post,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Post added successfully", docRef.id);
        postInputDiv.value = "";
      })
      .catch((error) => {
        console.log("Error adding post", error);
      });
  };

  // SUBMIT FORM

  formDiv.addEventListener("submit", (e) => {
    e.preventDefault();
    if (postInputDiv.value) {
      addPost(postInputDiv.value);
    } else {
      alert("Please enter username and text to post");
    }
  });

  // LISTEN FOR CHANGES

  const init = () => {
    db.collection("Forum Posts")
      .orderBy("timestamp")
      .onSnapshot((querySnapshot) => {
        listDiv.innerHTML = "";

        querySnapshot.forEach((doc) => {
          // console.log('id', doc.id)

          const li = document.createElement("li");
          li.innerHTML = `${doc.data().post} `;
          li.setAttribute("id", "list-text");

          const span2 = document.createElement("span");
          span2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>`;
          span2.title = "Edit";

          const span3 = document.createElement("form");
          span3.setAttribute("id", "newEdit");

          span2.setAttribute("id", "edit");
          span2.addEventListener("click", () => {
            span3.innerHTML =
              "<textarea class='form-control 'id='updateText' rows='1' placeholder='update post'>";
            li.appendChild(span3);

            const span4 = document.createElement("div");
            span4.setAttribute("class", "updateBtn");
            span4.innerHTML =
              "<button class='btn btn-danger' type='submit' id='updateBtn' >Update</button>";
            span3.appendChild(span4);

            span.setAttribute("class", "hide");
            span2.setAttribute("class", "hide");

            const newPost = document.getElementById("newEdit");
            const updateTextDiv = document.getElementById("updateText");

            newPost.addEventListener("submit", (e) => {
              e.preventDefault();
              if (updateTextDiv.value) {
                editPost(doc.id, updateTextDiv.value);
              } else {
                alert("Please complete the udpated post");
              }
            });
          });

          const span = document.createElement("span");
          span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>     <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
          span.setAttribute("id", "delete");
          span.title = "Delete";
          span.addEventListener("click", () => {
            deletePost(doc.id);
          });

          li.appendChild(span2);
          li.appendChild(span);

          listDiv.appendChild(li);
        });
      });
  };

  init();

  // API

  // GENERATE NEW QUESTION

  const generateQuestion = () => {
    const randomNumber = () => {
      const numPost = 49;
      return Math.floor(Math.random() * numPost) + 1;
    };

    fetch("https://opentdb.com/api.php?amount=49")
      .then((response) => response.json())
      .then(
        (data) =>
          (questionDiv.innerHTML = `${data.results[randomNumber()].question}`)
      );
  };

  generateBtnDiv.addEventListener("click", () => {
    generateQuestion();
  });

  const logout = document.getElementById("logout");

  logout.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //if user exist, that is logged in then sign them out
        firebase.auth().signOut();
      }
      window.location = "/html/home-signin.html";
    });
  });

  const name_of_user_signed_in = document.getElementById("name");
  function get_user_info() {
    //initialisING FUNCTION
    //Getting sign in and sign up details
    db.collection("Users")
      .orderBy("timestamp", "desc")
      .limit(1)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          console.log("id", doc.id);

          name_of_user_signed_in.innerHTML = `${doc.data().firstname} ${
            doc.data().lastname
          } `;
        });
      });
  }

  get_user_info();
});
