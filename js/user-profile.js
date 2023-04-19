document.addEventListener("DOMContentLoaded", function () {
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

  //Storing and database connection and retrieval of information
  const uploadfile = document.getElementById("uploadButton");
  const showfile = document.getElementById("showfile");

  const gallery = document.getElementById("gallery");

  let file = "";
  let extension = "";

  const db = firebase.firestore();

  uploadfile.addEventListener("change", function (e) {
    console.log("event", e.target.files[0]);
    file = e.target.files[0];
    filename = file.name.split(".").shift();
    extension = file.name.split(".").pop();

    // Create a db ID
  });

  showfile.addEventListener("click", function (e) {
    const id = db.collection("files").doc().id; //Creating a database id

    // Create a storage ref
    const storageRef = firebase.storage().ref(`files/${id}.${extension}`); //make a file refrence with the file id name in DB
    const uploadTask = storageRef.put(file);

    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log("downloadURL", downloadURL);
      db.collection("files")
        //Formed a connection with the storage
        //Updating Data base at same time
        .add({
          image: downloadURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          create_file_gallery();
          file = "";
          filename = "";
          extension = "";
        })
        .catch(function (error) {});
    });
  });

  function create_file_gallery() {
    gallery.innerHTML = "";
    const listRef = firebase.storage().ref("files");
    listRef.listAll().then(function (res) {
      res.items.forEach((itemRef) => {
        itemRef.getDownloadURL().then(function (downloadURL) {
          console.log("downloadURL", downloadURL);
          const imgarrange = document.createElement("div");
          imgarrange.className = "card col-md-2";
          const img = document.createElement("img");
          img.className = "image_set";
          img.src = downloadURL;
          imgarrange.append(img);
          gallery.append(imgarrange);
        });
      });
    });
  }
  create_file_gallery();

  const row1 = document.getElementById("row1");
  const row2 = document.getElementById("row2");
  const row3 = document.getElementById("row3");
  const row4 = document.getElementById("row4");
  const row5 = document.getElementById("row5");
  const full_name = document.getElementById("full_name");

  function get_user_info() {
    //initialisING FUNCTION
    //Getting sign in and sign up details
    db.collection("Users")
      .orderBy("timestamp", "desc")
      .limit(1)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          console.log("id", doc.id);

          full_name.innerHTML = `${doc.data().firstname} ${
            doc.data().lastname
          } `;
          const div1 = document.createElement("div");
          div1.className = "col-sm-9";
          div1.setAttribute("class", "hide");
          const div2 = document.createElement("div");
          div1.className = "col-sm-9";
          const div3 = document.createElement("div");
          div1.className = "col-sm-9";
          const div4 = document.createElement("div");
          div1.className = "col-sm-9";
          const div5 = document.createElement("div");
          div1.className = "col-sm-9";

          const p1 = document.createElement("p");
          p1.className = "mb-0";
          p1.innerHTML = `${doc.data().firstname} ${doc.data().lastname}`;

          const p2 = document.createElement("p");
          p2.className = "mb-0";
          p2.innerHTML = `${doc.data().email} `;

          const p3 = document.createElement("p");
          p3.className = "mb-0";
          p3.innerHTML = `${doc.data().phonenum} `;

          const p4 = document.createElement("p");
          p4.className = "mb-0";
          p4.innerHTML = `${doc.data().username} `;

          const p5 = document.createElement("p");
          p5.className = "mb-0";
          p5.innerHTML = `${doc.data().password} `;

          div1.append(p1);
          div2.append(p2);
          div3.append(p3);
          div4.append(p4);
          div5.append(p5);

          row1.append(div1);
          row2.append(div2);
          row3.append(div3);
          row4.append(div4);
          row5.append(div5);
        });
      });
  }

  get_user_info();

  const refresh = document.getElementById("refresh");

  refresh.addEventListener("click", function () {
    window.location.reload();
  });
});
