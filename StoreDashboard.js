var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var StoreDashboard = function (_React$Component) {
  _inherits(StoreDashboard, _React$Component);

  function StoreDashboard(props) {
    _classCallCheck(this, StoreDashboard);

    var _this = _possibleConstructorReturn(this, (StoreDashboard.__proto__ || Object.getPrototypeOf(StoreDashboard)).call(this, props));

    _this.initFirebase = function () {
      if (!firebase.apps.length) firebase.initializeApp(_this.firebaseConfig);
    };

    _this.getFirebaeData = function (node, subNode) {
      console.log("=============", subNode);
      console.log(typeof subNode === "undefined" ? "undefined" : _typeof(subNode));
      if (subNode !== undefined) {
        console.log("====if=========");
        return firebase.database().ref("/" + node + "/").child(subNode).once("value").then(function (snapshot) {
          return snapshot.val();
        });
      } else {
        console.log("else");
        return firebase.database().ref("/" + node + "/").once("value").then(function (snapshot) {
          return snapshot.val();
        });
      }
    };

    _this.handleClick = function () {
      _this.getFirebaeData("satsangiUsers-store-requests").then(function (d) {
        console.log(d);
        var users = Object.keys(d);
        console.log(users);
      });
      _this.setState({ liked: true });
    };

    _this.state = { liked: false };

    _this.firebaseConfig = {
      apiKey: "AIzaSyC13btHGEnl-JB6TDaa05D-5Pk28jyWekQ",
      authDomain: "pune-ams.firebaseapp.com",
      databaseURL: "https://pune-ams-default-rtdb.firebaseio.com",
      projectId: "pune-ams",
      storageBucket: "pune-ams.appspot.com",
      messagingSenderId: "178023651028",
      appId: "1:178023651028:web:16bf3a7e6df57cad73cd41"
    };
    return _this;
  }

  _createClass(StoreDashboard, [{
    key: "render",
    value: function render() {
      if (this.state.liked) {
        return "You liked this.";
      }

      return React.createElement(
        "button",
        { onClick: this.handleClick },
        "Get data"
      );
    }
  }]);

  return StoreDashboard;
}(React.Component);

var domContainer = document.querySelector("#store");
ReactDOM.render(React.createElement(StoreDashboard, null), domContainer);