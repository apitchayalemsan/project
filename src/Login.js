import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import md5 from 'md5';

export default function Login() {
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate(); // เรียกใช้ useNavigate() เพื่อให้ได้ฟังก์ชัน navigate ที่ถูกต้อง


    const onLogin = (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            doLogin();
        }
    }

    const getAuthenToken = async() =>{
        const response = await fetch(
            "http://localhost:8080/api/authen_request",
            {
                method: "POST",
                headers:{
                    Accept:"application/json",

                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: md5(username)
                })
            }
        );

        const data = await response.json();

        console.log(data);
    }

    const getAccessToken = async (authToken) => {
        var baseString = username + "&" + md5(password);
        var authenSignature = md5(baseString);

        const response = await fetch(
            "http://localhost:8080/api/access_request",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    authen_signature: authenSignature,
                    auth_token: authToken
                })
            }
        );

        const data = await response.json();
        return data;
    };


    const doLogin = async () => {
        // const data1 = await getAuthenToken();
        // const authToken = data1.data.auth_token;

        // console.log(data1);


        // const data2 = await getAccessToken(authToken);

        // console.log(data2);

        // localStorage.setItem("access_token",data2.data.access_token);
        // localStorage.setItem("user_id",data2.data.account_info.user_id);
        // localStorage.setItem("username",username);
        // localStorage.setItem("first_name",data2.data.account_info.first_name);
        // localStorage.setItem("last_name",data2.data.account_info.last_name);
        // localStorage.setItem("email",data2.data.account_info.email);
        // localStorage.setItem("role_id",data2.data.account_info.role_id);
        // localStorage.setItem("role_name",data2.data.account_info.role_name);

        // navigate("home", {replace: false });

    // }

        const response = await fetch(
            "http://localhost:8080/login",
            {
                method: "POST",
                headers:{
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (data.result){
            navigate("home", {replace: false});
        }
    }


    return (
                <div className='container m-auto'>
                    <Form noValidate validated={validated} onSubmit={onLogin}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="validateUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอก Username
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="validatePassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอก Password
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-primary" type="submit">Login</button>
                                <button className="btn btn-outline-primary" disabled type="submit">Signup</button>
                            </div>
                        </Row>
                    </Form>
                </div>
            );

}





///////////////////////////////////////////////////////////////////////////


// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useState } from 'react';
// import { Form, Row, Col, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import md5 from 'md5';

// export default function Login() {
//     const [validated, setValidated] = useState(false);
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");

//     let navigate = useNavigate(); // เรียกใช้ useNavigate() เพื่อให้ได้ฟังก์ชัน navigate ที่ถูกต้อง

//     const onLogin = (event) => {
//         const form = event.currentTarget;
//         event.preventDefault();

//         if(form.checkValidity() === false) {
//             event.stopPropagation();
//         } else {
//             doLogin();
//         }
//     }

//     const getAuthenToken = async() => {
//         const response = await fetch(
//             "http://localhost:8080/api/authen_request",
//             {
//                 method: "POST",
//                 headers:{
//                     Accept: "application/json",
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: md5(username)
//                 })
//             }
//         );

//         const data = await response.json();
//         console.log(data);
//         return data;
//     }

//     const getAccessToken = async (authToken) => {
//         var baseString = username + "&" + md5(password);
//         var authenSignature = md5(baseString);

//         const response = await fetch(
//             "http://localhost:8080/api/access_request",
//             {
//                 method: "POST",
//                 headers: {
//                     Accept: "application/json",
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     authen_signature: authenSignature,
//                     auth_token: authToken
//                 })
//             }
//         );

//         const data = await response.json();
//         console.log(data);
//         return data;
//     };

//     const doLogin = async () => {
//         const response = await fetch(
//             "http://localhost:8080/login",
//             {
//                 method: "POST",
//                 headers:{
//                     Accept: "application/json",
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: username,
//                     password: password
//                 })
//             }
//         );

//         const data = await response.json();
//         console.log(data);

//         if (data.result) {
//             // บันทึกข้อมูลลง localStorage
//             localStorage.setItem("access_token", data.access_token);
//             localStorage.setItem("user_id", data.user_id);
//             localStorage.setItem("username", username);
//             localStorage.setItem("first_name", data.first_name);
//             localStorage.setItem("last_name", data.last_name);
//             localStorage.setItem("email", data.email);
//             localStorage.setItem("role_id", data.role_id);
//             localStorage.setItem("role_name", data.role_name);

//             // แยก role ในการเข้าระบบ
//             if (data.role_id === 1) {
//                 navigate("home", { replace: true });
//             } else if (data.role_name === 'admin') {
//                 navigate("admin/home", { replace: true });
//             } else if (data.role_name === 'user') {
//                 navigate("user/home", { replace: true });
//             } else {
//                 navigate("default/home", { replace:false });
//             }
//         }
//     }

//     return (
//         <div className='container m-auto'>
//             <Form noValidate validated={validated} onSubmit={onLogin}>
//                 <Row className="mb-3">
//                     <Form.Group as={Col} controlId="validateUsername">
//                         <Form.Label>Username</Form.Label>
//                         <Form.Control
//                             required
//                             type="text"
//                             placeholder="Username"
//                             onChange={(e) => setUsername(e.target.value)}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             กรุณากรอก Username
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                 </Row>
//                 <Row className="mb-3">
//                     <Form.Group as={Col} controlId="validatePassword">
//                         <Form.Label>Password</Form.Label>
//                         <Form.Control
//                             required
//                             type="password"
//                             placeholder="Password"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             กรุณากรอก Password
//                         </Form.Control.Feedback>
//                     </Form.Group>
//                 </Row>
//                 <Row>
//                     <div className="d-grid gap-2 col-6 mx-auto">
//                         <button className="btn btn-primary" type="submit">Login</button>
//                         <button className="btn btn-outline-primary" disabled type="submit">Signup</button>
//                     </div>
//                 </Row>
//             </Form>
//         </div>
//     );
// }
