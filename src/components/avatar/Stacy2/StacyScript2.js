import img from "../../assets/AgadoStacy.jpeg";
import mediapipeToMixamo, { MixamoBones } from "./mediapipeToMixamo";
import shula from "./shula.json";
import testFunction from "./testFunction";

async function StacyScript() {
  // Set our main variables
  let scene,
    renderer,
    camera,
    model, // Our character
    // neck, // Reference to the neck bone in the skeleton
    // waist, // Reference to the waist bone in the skeleton
    mixer, // THREE.js animations mixer
    clock = new THREE.Clock(); // Used for anims, which run to a clock instead of frame rate

  init();

  async function init() {
    const MODEL_PATH =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb";

    const canvas = document.querySelector("#c");
    const backgroundColor = 0xf1f1f1;

    // Init the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);

    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    const wrapper = document.getElementById("wrapper");
    wrapper.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = -3;

    let stacy_txt = new THREE.TextureLoader().load(img);

    stacy_txt.flipY = false; // we flip the texture so that its the right way up

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true,
    });

    var loader = new THREE.GLTFLoader();

    //! Conversion from MediaPipe to Mixamo
    const converted = mediapipeToMixamo(shula);
    const firstPose = shula.frames[0]["3d_pose"];
    const convertedTest = testFunction(firstPose);
    console.log(convertedTest);

    loader.load(
      MODEL_PATH,
      function (gltf) {
        // A lot is going to happen here
        model = gltf.scene;

        const stacy = model.children[0].children[0];
        // console.log(stacy);
        const { bones } = stacy.skeleton;
        // console.log(bones);

        bones.forEach((bone) => {
          Object.defineProperties(bone, {
            position: {
              writable: true,
            },
            rotation: {
              writable: true,
            },
          });
        });


        bones[0].position = convertedTest.HipsBone.end;
        bones[2].position = convertedTest.Spine1Bone.tbone;
        bones[2].rotation = convertedTest.Spine1Bone.rbone;

        // const boneList = {};
        // console.log(skeleton.bones);

        // skeleton.bones.forEach((bone) => {
        //   const start = bone.position.clone();
        //   const end = new THREE.Vector3().setFromMatrixPosition(
        //     bone.matrixWorld
        //   );
        //   const boneLength = start.distanceTo(end);
        //   console.log(`Bone name: ${bone.name.replace("mixamorig", "")}
        //     Start position: ${start.toArray()}
        //     End position: ${end.toArray()}
        //     Length: ${boneLength}`);
        // });

        // let test = {};

        // function jsonparse(bone) {
        //   const { name, position, rotation, scale, matrixWorld, quaternion, parent } =
        //     bone;
        //   const relativeEnd = new THREE.Vector3().setFromMatrixPosition(
        //     matrixWorld
        //   );
        //   const length = position.distanceTo(relativeEnd);
        //   let childrenList = {};
        //   if (bone.children.length > 0) {
        //     childrenList = bone.children.map((bone) => jsonparse(bone));
        //   }
        //   return {
        //     name,
        //     start: position,
        //     end: relativeEnd,
        //     parent: parent.position,
        //     length,
        //     rotation,
        //     scale,
        //     quaternion,
        //     children: childrenList,
        //   };
        // }

        // skeleton.bones.forEach((bone, i) => {
        //   test[i] = jsonparse(bone)
        // });

        // const test = jsonparse(model.children[0].children[1]);

        // const bonesJson = JSON.stringify(test);

        // const blob = new Blob([bonesJson], { type: "application/json" });

        // const url = URL.createObjectURL(blob);

        // const link = document.createElement("a");
        // link.href = url;
        // link.download = "data.json";
        // link.click();

        // URL.revokeObjectURL(url);

        // fs.writeFile("bones.json", bonesJson, "utf-8");

        // skeleton.bones.forEach((bone, i) => {
        //   Object.defineProperties(bone, {
        //     position: {
        //       writable: true,
        //     },
        //   });
        //   bone.name = bone.name.replace("mixamorig", "");
        //   if (MixamoBones[bone.name] != undefined) {
        //     // console.log(bone.name);
        //     // console.log("shula ", shula.frames);
        //     // console.log("Old p: ", bone.position);
        //     // bone.position = converted[0][MixamoBones[bone.name]];
        //     const mixX = converted[0][MixamoBones[bone.name]].x ;
        //     const mixY = converted[0][MixamoBones[bone.name]].y ;
        //     const mixZ = converted[0][MixamoBones[bone.name]].z ;
        //     bone.position.x = mixX;
        //     bone.position.y = mixY;
        //     bone.position.z = mixZ;
        //     bone.position = converted[0][MixamoBones[bone.name]];
        //     // console.log("New p: ", bone.position);
        //   }
        // });

        model.traverse((o) => {
          //To get the list of all the bones
          // console.log(o.type);

          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
          }

          // if (o.isBone) {
          //   console.log(o)
          // }
        });

        // Set the models initial scale (its size)
        model.scale.set(10, 10, 10);
        model.position.y = 0;

        scene.add(model);
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );

    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);

    // Floor
    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xdcdcdc,
      shininess: 0,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);

    let geometry = new THREE.SphereGeometry(8, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0x8183f7 }); // 0xf2ce2e
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -15;
    sphere.position.y = -2.5;
    sphere.position.x = -0.25;
    scene.add(sphere);
  }

  function update() {
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
}

export default StacyScript;
