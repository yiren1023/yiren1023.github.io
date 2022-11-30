//window.onload = function () {

  let button = document.getElementById("transButton");
  button.onclick = buttonClicked;

  var scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 0);
  camera.lookAt(-1, 0, 0);
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  function displayOriginalPolyhedron() {
    camera.position.set(0, 10, 0);
    while(scene.children.length > 0){ 
      scene.remove(scene.children[0]); 
    }

    let axesHelper = new THREE.AxesHelper( 10 );
    scene.add( axesHelper );

    let polyhedron = createPolyhedron();
    console.log("Initial poly :");
    console.log(polyhedron.points);
    console.log(polyhedron.faces);
    let threePolyhedron = polyhedron.toThreePolyhedron();
    //threePolyhedron.position.set(0, 0, -7);

    scene.add(threePolyhedron);
  }

  function displayTransformedPolyhedron() {
    camera.position.set(1, 5, 0);
    //camera.lookAt(-1, 0, 0.1);
    while(scene.children.length > 0){ 
      scene.remove(scene.children[0]); 
    }

    let axesHelper = new THREE.AxesHelper( 10 );
    scene.add( axesHelper );

    let trans = createPolyhedron().getPolyAfterTran();
    console.log("Poly after trans :");
    console.log(trans.points);
    console.log(trans.faces);
    let threeTrans = trans.toThreePolyhedron();
    //threeTrans.position.set(0, 0, -7);
    
    scene.add(threeTrans);
  }

  //camera.position.z = 5; // TODO ?

  function animate() {
    requestAnimationFrame(animate);
    //scene.children[0].rotation.x += 0.01;
    for (let i = 0; i < scene.children.length; i++) {
      scene.children[i].rotation.y = -Math.PI / 2;
      scene.children[i].rotation.z += 0.01;
    }

    renderer.render(scene, camera);
  }

  function createPolyhedron() {
    /*let points = [
      new Point(2, 2, -0.5, 0),
      new Point(2, -2, -0.5, 1),
      new Point(2, 2, -4, 2),
      new Point(2, -2, -4, 3),
      new Point(-1, 1, 1, 4),
      new Point(-3, 3, -2, 5)
    ];*/
    let points = [
      new Point(0, 2, 1, 0),
      new Point(2, 0, 1, 1),
      new Point(0, 3, 3, 2),
      new Point(3, 0, 3, 3),
      new Point(0, 0, -1, 4),
      new Point(-2, -2, 2, 5)
    ]
    let faces = [
      [points[0], points[4], points[5]],
      [points[0], points[1], points[4]],
      [points[1], points[4], points[5]],
      [points[0], points[1], points[3], points[2]],
      [points[1], points[3], points[5]],
      [points[2], points[3], points[5]],
      [points[0], points[2], points[5]]
    ];
    return new Polyhedron(points, faces);
  }

  function buttonClicked() {
    if (button.value == "Apply transformation") {
      button.value = "Display original polyhedron";
      displayTransformedPolyhedron();
    } else {
      button.value = "Apply transformation";
      displayOriginalPolyhedron();
    }
  }

  displayOriginalPolyhedron();
  animate();
