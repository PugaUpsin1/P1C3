  // Import the functions you need from the SDKs you need
  import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
  import {getDatabase,onValue,ref,set,child,get,update,remove}
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
  import { getStorage, ref as refS, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAgX0MNEF42qqiMLThM22249Ztxt3qlE_4",
    authDomain: "proyectos-8236d.firebaseapp.com",
    projectId: "proyectos-8236d",
    storageBucket: "proyectos-8236d.appspot.com",
    messagingSenderId: "536807091844",
    appId: "1:536807091844:web:ea4d471fda8d9486b65cd1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();

  //Declaracionde Objetos

  var btnInsertar = document.getElementById('btnInsertar');
  var btnBuscar = document.getElementById('btnBuscar');
  var btnActualizar = document.getElementById('btnActualizar');
  var btnBorrar = document.getElementById('btnBorrar');
  var btnLimpiar = document.getElementById('btnLimpiar');
  var lista = document.getElementById('lista');
  var archivo = document.getElementById('archivo');
  var btnMostrarImagen = document.getElementById('verImagen');

  

//insertE
  var martricula = "";
  var nombre = "";
  var carrera = "";
  var genero = "";

  function leerInputs(){
    
    martricula = document.getElementById('matricula').value;
    nombre = document.getElementById('nombre').value;
    carrera = document.getElementById('carrera').value;
    genero = document.getElementById('genero').value;

   // alert(" matricula " + martricula + " nombre " + nombre + " carrera " + carrera);
  }

  function InsertarDatos() {
    leerInputs();
    if(matricula== "" || carrera=="" || nombre==""){
      alert("Favor de llenar los campos")
    }else{
    set(ref(db,'alumnos/' + martricula),{
        nombre:nombre,
        carrera:carrera,
        genero:genero
    }).then((response) => {
        alert("Se Agrego el registro con exito");
    }).catch((error) => {
        alert("Surgio un error " + error);
    })
    }
  }

  function mostrarDatos(){
    leerInputs();
    const dbref = ref(db);
    get(child(dbref,'alumnos/'+ martricula)).then((snapshot)=>{

      if(snapshot.exists()){

        nombre = snapshot.val().nombre;
        carrera = snapshot.val().carrera;
        genero = snapshot.val().genero;
        escribirInputs();

        alert("Exito en consulta")

      }
      else{

        alert("No existe la matricula")

      }

    });

  }


  function mostrarLista(){
    const dbref = ref(db, 'alumnos');
  
    onValue(dbref, (snapshot)=>{
      lista.innerHTML="";
      snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        lista.innerHTML = lista.innerHTML + "<div class= 'campo'>" + " "+childKey + " "+childData.nombre + " "+childData.carrera + " "+childData.genero + "<br> </div>"
      });
  
    },{
      onlyOnce: true
    });
  
  }

  function actualizar(){
    leerInputs();
    update(ref(db,'alumnos'+martricula),{
      nombre:nombre,
      carrera:carrera,
      genero:genero
    }).then(()=>{
      alert("Se realizo la actualización");
      mostrarDatos();
    }).catch(()=>{
      alert("Se registro un error");
    });
  }

  function borrar(){
    leerInputs();
    remove(ref(db,'alumnos/' + martricula)).then(()=>{
      alert("Se borro");
      mostrarDatos();
    }).catch(()=>{
      alert("causo error " + error);
    })
  }

  function escribirInputs(){
    document.getElementById('nombre').value =  nombre;
    document.getElementById('carrera').value = carrera;
    document.getElementById('genero').value = genero;
  }

  function limpiar(){
    lista.innerHTML="";
    matricula="";
    nombre="";
    carrera="";
    genero="Masculino";
    escribirInputs();
  }

function cargarImagen(){
  const file = event.target.files[0];
  const name = event.target.files[0].name;


  const storage = getStorage();

  const storageRef = refS(storage, 'imagenes/' + name);

  // 
  uploadBytes(storageRef,file).then((snapshot)=>{
    document.getElementById('imgNombre').value = name;
    alert('Se cargo el Archivo');
  });
}

function descargarImagen(){
  archivo = document.getElementById('imgNombre')
  const storage = getStorage();
  const storageRef = refS(storage, 'imagenes/' + archivo);

  // Get the download URL
  getDownloadURL(storageRef)
    .then((url) => {
      document.getElementById('url').value = url;
    })
    .catch((error) => {
      switch (error.code) {
        case 'storage/object-not-found':
          console.log('No existe el archivo')
          break;
        case 'storage/unauthorized':
          console.log('No tiene permisos')
          break;
        case 'storage/canceled':
          console.log('Se cancelo o no tiene internet')
          break;
        case 'storage/unknown':
          console.log('Surgio al inesperado')
          break;
      }
    });


}
  //eventos click
  btnInsertar.addEventListener('click', InsertarDatos);
  btnBuscar.addEventListener('click', mostrarDatos);
  btnMostrar.addEventListener('click',mostrarLista);
  btnActualizar.addEventListener('click',actualizar);
  btnBorrar.addEventListener('click',borrar);
  btnLimpiar.addEventListener('click',limpiar);
  archivo.addEventListener('change',cargarImagen)
  btnMostrarImagen.addEventListener('click',descargarImagen)
