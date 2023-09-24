// const firebase = require("firebase/app")

// require("firebase/auth");
// require("firebase/database");

// const saveDataToFirebase = async (node, subNode, data) => {
//   return await firebase.database().ref(node).child(subNode).set(data);
// };

// const updateDataToFirebase = async (node, subNode, subWayNode, data) => {
//   return await firebase
//     .database()
//     .ref(node)
//     .child(subNode)
//     .child(subWayNode)
//     .push(data);
// };

// const updateDataToFirebaseTwoNodeStructFB = async (
//   node,
//   subNode,
//   data
// ) => {
//   return await firebase.database().ref(node).child(subNode).push(data);
// };

class StoreDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };

    this.firebaseConfig = {
      apiKey: "AIzaSyC13btHGEnl-JB6TDaa05D-5Pk28jyWekQ",
      authDomain: "pune-ams.firebaseapp.com",
      databaseURL: "https://pune-ams-default-rtdb.firebaseio.com",
      projectId: "pune-ams",
      storageBucket: "pune-ams.appspot.com",
      messagingSenderId: "178023651028",
      appId: "1:178023651028:web:16bf3a7e6df57cad73cd41",
    };
  }

  initFirebase = () => {
    if (!firebase.apps.length) firebase.initializeApp(this.firebaseConfig);
  };

  getFirebaeData = (node, subNode) => {
    console.log("=============",subNode);
    console.log(typeof subNode);
    if (subNode !== undefined) {
      console.log("====if=========");
      return firebase
        .database()
        .ref("/" + node + "/")
        .child(subNode)
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        });
    } else {
      console.log("else");
      return firebase
        .database()
        .ref("/" + node + "/")
        .once("value")
        .then((snapshot) => {
          return snapshot.val();
        });
    }
  };

  handleClick = () => {
    this.getFirebaeData("satsangiUsers-store-requests").then((d) => {
      console.log(d);
      const users = Object.keys(d);
      console.log(users)
      
    });
    this.setState({ liked: true });
  };

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return <button onClick={this.handleClick}>Get data</button>;
  }
}

let domContainer = document.querySelector("#store");
ReactDOM.render(<StoreDashboard />, domContainer);
