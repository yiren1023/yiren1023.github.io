class Point {
  constructor(x, y, z, id, corresponding_point) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = id;
    this.corresponding_point = corresponding_point;
  }

  get_corresponding_point() {
    return this.corresponding_point;
  }

  substract(B) {
    return new Point(this.x - B.x, this.y - B.y, this.z - B.z);
  }

  normal(B) {
    //   (x1, y1, z1)
    // x (x2, y2, z2)
    return new Point(
      this.y * B.z - B.y * this.z,
      -(this.x * B.z - B.x * this.z),
      this.x * B.y - B.x * this.y
    );
  }

  getPointAfterTran() {
    this.corresponding_point = new Point(
      this.x / this.z,
      this.y / this.z,
      -1 / this.z,
      this.id,
      this
    );
    return this.corresponding_point;
  }
}

class Plane {
  // Planes of the form ax + by + cz = d
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }
}

class Polyhedron {
  constructor(points, faces) {
    this.points = points;
    this.faces = faces;

    //this.planeSet = this.getPlaneSet();
  }

  getPlaneSet() {
    let planeSet = [];
    for (let f = 0; f < this.faces.length; f++) {
      let v = this.faces[f][0].substract(this.faces[f][1]);
      let w = this.faces[f][1].substract(this.faces[f][2]);
      let n = v.normal(w);
      let d =
        n.x * this.faces[f][0].x +
        n.y * this.faces[f][0].y +
        n.z * this.faces[f][0].z;
      planeSet.push(new Plane(n.x, n.y, n.z, d));
    }
    return planeSet;
  }

  triangulation(face) {
    let triangles = [];
    let i = 1;
    while (i + 1 < face.length) {
      let triangle = [];
      triangle.push(face[0]);
      triangle.push(face[i]);
      triangle.push(face[i + 1]);
      triangles.push(triangle);
      i++;
    }

    return triangles;
  }

  toThreePolyhedron() {
    let geom = new THREE.BufferGeometry();
    let faces = [];

    for (let f = 0; f < this.faces.length; f++) {
      let triangulation = this.triangulation(this.faces[f]);
      for (let t = 0; t < triangulation.length; t++) {
        let triangle = triangulation[t];
        faces.push(new THREE.Vector3(triangle[0].x, triangle[0].y, triangle[0].z));
        faces.push(new THREE.Vector3(triangle[1].x, triangle[1].y, triangle[1].z));
        faces.push(new THREE.Vector3(triangle[2].x, triangle[2].y, triangle[2].z));
      }
    }
    geom.setFromPoints(faces);
    geom.computeVertexNormals();
    let material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
    let threePolyhedron = new THREE.Mesh(geom, material);
    return threePolyhedron;
  }

  getPolyAfterTran() {
    /*
    let newPoints = [];
    for (let p = 0; p < this.points.length; p++) {
      newPoints.push(this.points[p].getPointAfterTran());
    }

    let newFaces = [];
    for (let f = 0; f < this.faces.length; f++) {
      let oldFace = this.faces[f];
      let newFace = [];
      let p = 0;  // index of point in the face
      while (p < oldFace.length) {
        //if (newPoints[oldFace[p].id].z > 0) {
        console.log(oldFace[p]);
        console.log(oldFace[(p - 1) % oldFace.length]);
        console.log(oldFace[(p + 1) % oldFace.length]);
        if ((oldFace[p].z < 0)
            || (this.getPrev(p, oldFace).z < 0)
            || (this.getNext(p, oldFace).z < 0)) {
          newFace.push(newPoints[oldFace[p].id]);
        }
        p++;
      }
      if (newFace.length >= 3) {
        newFaces.push(newFace);
      }
    }
    return new Polyhedron(newPoints, newFaces);
    */
    let oldPoints = this.points
    let newPoints = []
    let oldFaces = this.faces
    let newFaces = []
    for (let p = 0; p < this.points.length; p++) {
      newPoints.push(oldPoints[p].getPointAfterTran());
    }
    for (let f = 0; f < oldFaces.length; f++) {
      let oldFace = this.faces[f];
      let newFace = [];
      for (let p = 0; p < oldFace.length; p++) {
        if (oldFace[p].z > 0) {
          newFace.push(oldFace[p].get_corresponding_point())
        }
        if (oldFace[p].z < 0 &&
                this.getPrev(p, oldFace).z > 0) {
          let currentAfterTran = oldFace[p].get_corresponding_point();
          let prevAfterTran = this.getPrev(p, oldFace).get_corresponding_point();
          let v_x = prevAfterTran.x - currentAfterTran.x;
          let v_y = prevAfterTran.y - currentAfterTran.y;
          let v_z = prevAfterTran.z - currentAfterTran.z;
          let farPoint = new Point(currentAfterTran.x + 5*v_x, 
                                   currentAfterTran.y + 5*v_y, 
                                   currentAfterTran.z + 5*v_z, 
                                   newPoints.length, 
                                   null);
          newPoints.push(farPoint);
          newFace.push(farPoint);
        }
        if (oldFace[p].z < 0 &&
                this.getNext(p, oldFace).z > 0) {
          let currentAfterTran = oldFace[p].get_corresponding_point();
          let nextAfterTran = this.getNext(p, oldFace).get_corresponding_point();
          let v_x = nextAfterTran.x - currentAfterTran.x;
          let v_y = nextAfterTran.y - currentAfterTran.y;
          let v_z = nextAfterTran.z - currentAfterTran.z;
          let farPoint = new Point(currentAfterTran.x + 5*v_x, 
                                   currentAfterTran.y + 5*v_y, 
                                   currentAfterTran.z + 5*v_z, 
                                   newPoints.length, 
                                   null);
          newPoints.push(farPoint);
          newFace.push(farPoint);
        }
      }
      if (newFace.length >= 3) {
        newFaces.push(newFace);
      }
    }

    for (let f = 0; f < oldFaces.length; f++) {
      let oldFace = this.faces[f];
      let newFace = [];
      for (let p = 0; p < oldFace.length; p++) {
        if (oldFace[p].z < 0) {
          newFace.push(oldFace[p].get_corresponding_point())
        }
        if (oldFace[p].z > 0 &&
                this.getPrev(p, oldFace).z < 0) {
          let currentAfterTran = oldFace[p].get_corresponding_point();
          let prevAfterTran = this.getPrev(p, oldFace).get_corresponding_point();
          let v_x = prevAfterTran.x - currentAfterTran.x;
          let v_y = prevAfterTran.y - currentAfterTran.y;
          let v_z = prevAfterTran.z - currentAfterTran.z;
          let farPoint = new Point(currentAfterTran.x + 5*v_x, 
                                   currentAfterTran.y + 5*v_y, 
                                   currentAfterTran.z + 5*v_z, 
                                   newPoints.length, 
                                   null);
          newPoints.push(farPoint);
          newFace.push(farPoint);
        }
        if (oldFace[p].z > 0 &&
                this.getNext(p, oldFace).z < 0) {
          let currentAfterTran = oldFace[p].get_corresponding_point();
          let nextAfterTran = this.getNext(p, oldFace).get_corresponding_point();
          let v_x = nextAfterTran.x - currentAfterTran.x;
          let v_y = nextAfterTran.y - currentAfterTran.y;
          let v_z = nextAfterTran.z - currentAfterTran.z;
          let farPoint = new Point(currentAfterTran.x + 5*v_x, 
                                   currentAfterTran.y + 5*v_y, 
                                   currentAfterTran.z + 5*v_z, 
                                   newPoints.length, 
                                   null);
          newPoints.push(farPoint);
          newFace.push(farPoint);
        }
      }
      if (newFace.length >= 3) {
        newFaces.push(newFace);
      }
    }

    return new Polyhedron(newPoints, newFaces);
  }

  getPrev(index, face) {
    let newIndex = index - 1;
    if (newIndex < 0) {
      newIndex = face.length - 1;
    }
    return face[newIndex];
  }

  getNext(index, face) {
    let newIndex = index + 1;
    if (newIndex >= face.length) {
      newIndex = 0;
    }
    return face[newIndex];
  }
}
