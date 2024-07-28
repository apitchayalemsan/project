import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // ไอคอน Bootstrap
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, Dropdown, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import './Processbuy.css'; // นำเข้าไฟล์ CSS ที่คุณเพิ่มด้านบน
import PriceChart from './PriceChart.js';

export default function Processbuy() {
    const [price, setPrice] = useState('');
    const [firstField, setFirstField] = useState(''); // State สำหรับเก็บค่าของช่องแรก
    const [weight, setWeight] = useState(''); // น้ำหนัก(กก.)
    const [percentage, setPercentage] = useState(''); // เปอร์เซ็น
    const [dryRubber, setDryRubber] = useState(''); // ยางแห้ง
    const [totalPrice, setTotalPrice] = useState(''); // ราคารวมทั้งหมด
    const [seller, setSeller] = useState(''); // State สำหรับเก็บค่าชื่อผู้ขาย
    const [formData, setFormData] = useState([]); // State สำหรับเก็บข้อมูลฟอร์ม
    const [showAlert, setShowAlert] = useState(false); // State สำหรับการแสดงข้อความแจ้งเตือน
    const [showPrintModal, setShowPrintModal] = useState(false); // State สำหรับการแสดง Modal
    const [showChart, setShowChart] = useState(false); // State สำหรับการแสดงกราฟ
    
    useEffect(() => {
        fetchFormData();
        fetchPriceHistory();
    }, []);
    
    const fetchPriceHistory = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/getPriceHistory');
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching price history:', error);
        }
    };

    const fetchFormData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/getHistory');
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching form data:', error);
        }
    };

    useEffect(() => {
        const savedPrice = localStorage.getItem('price');
        if (savedPrice) {
            setPrice(savedPrice);
            setFirstField(savedPrice);
        }
    }, []);

    const handleSavePrice = async () => {
        setFirstField(price); // บันทึกค่า price ใน firstField
        localStorage.setItem('price', price);
    
        const date = new Date().toLocaleDateString('en-CA'); // วันที่ในรูปแบบที่ฐานข้อมูลรองรับ
        try {
            await axios.post('http://localhost:8080/api/savePrice', { date, price });
            console.log('Price saved successfully');
        } catch (error) {
            console.error('Error saving price to database:', error.response ? error.response.data : error.message);
        }
    };

    const handleCalculate = () => {
        const dryWeight = (parseFloat(weight) * parseFloat(percentage)) / 100; // คำนวณยางแห้ง
        setDryRubber(dryWeight.toFixed(2)); // แสดงผลยางแห้ง

        const total = dryWeight * parseFloat(price); // คำนวณราคารวมทั้งหมด
        setTotalPrice(total.toFixed(2)); // แสดงผลราคารวมทั้งหมด
    };

    const handleSaveForm = async () => {
        const newEntry = {
            date: new Date().toLocaleDateString('en-CA'),
            seller,
            price: firstField,
            weight,
            percentage,
            dryRubber,
            totalPrice
        };

        try {
            await axios.post('http://localhost:8080/api/saveForm', newEntry);
            const updatedFormData = [...formData, newEntry];
            setFormData(updatedFormData);
            localStorage.setItem('formData', JSON.stringify(updatedFormData));
            console.log(newEntry);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            console.error('Error saving form data:', error.response ? error.response.data : error.message);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">');
        printWindow.document.write('</head><body >');
        printWindow.document.write(document.getElementById('printableContent').innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <Container fluid>
            {/* Navbar */}
            <Navbar className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Brand</Navbar.Brand>
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link href="#contact">ติดต่อเรา</Nav.Link>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                ผู้รับซื้อ
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#profile">ข้อมูลส่วนตัว</Dropdown.Item>
                                <Dropdown.Item href="#logout">ออกจากระบบ</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar>

            {/* Sidebar */}
            <Row>
                <Col xs={2} style={{ backgroundColor: '#D2B48C', height: '100vh', padding: '0' }}>
                    <Nav defaultActiveKey="home" className="flex-column p-3" style={{ height: '100%' }} >
                        <Nav.Link href="home" className="text-white">หน้าแรก</Nav.Link>
                        <Nav.Link href="processbuy" className="text-white active" >รับซื้อน้ำยางพารา</Nav.Link>
                        <Nav.Link href="history" className="text-white">ประวัติการรับซื้อ</Nav.Link>
                        <Nav.Link href="#daily" className="text-white">จัดการข้อมูลรับซื้อรายวัน</Nav.Link>
                        <Nav.Link href="#results" className="text-white">แสดงผลการรับซื้อ</Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content */}
                <Col xs={10} style={{ padding: '20px' }}>
                    {showAlert && <Alert variant="success">บันทึกข้อมูลเรียบร้อยแล้ว</Alert>}
                    <Form>
                        <Row className="mb-3">
                            <Col xs={6}>
                                <Form.Group controlId="price">
                                    <Form.Label>ราคารับซื้อวันนี้</Form.Label>
                                    <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Label>&nbsp;</Form.Label>
                                <div>
                                    <Button variant="secondary" className="me-2" onClick={handleSavePrice}>บันทึก</Button>
                                    <Button variant="danger" onClick={() => setShowChart(true)}>แสดงกราฟ</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>

                    <h6>กรุณากรอกข้อมูลการรับซื้อน้ำยางสดเพื่อนำไปคำนวณราคา</h6>
                    <Form className="printableArea">
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>วัน/เดือน/ปี</Form.Label>
                                <Form.Control type="text" placeholder="ว/ด/ป" readOnly value={new Date().toLocaleDateString()} />
                            </Col>
                            <Col>
                                <Form.Label>ชื่อผู้ขาย</Form.Label>
                                <Form.Control type="text" placeholder="ชื่อผู้ขาย" onChange={(e) => setSeller(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Label>ราคา(บาท.)</Form.Label>
                                <Form.Control type="text" placeholder="ราคา" value={firstField} readOnly />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Label>น้ำหนัก(กก.)</Form.Label>
                                <Form.Control type="text" placeholder="น้ำหนัก(กก.)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Label>เปอร์เซ็น</Form.Label>
                                <Form.Control type="text" placeholder="เปอร์เซ็น" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
                            </Col>
                            <Col>
                                <Form.Label>ยางแห้ง</Form.Label>
                                <Form.Control type="text" placeholder="ยางแห้ง" value={dryRubber} readOnly />
                            </Col>
                        </Row>

                        <Col xs={6} className="d-flex align-items-end">
                            <Button variant="secondary" onClick={handleCalculate}>คิดเงิน</Button>
                        </Col>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="totalPrice">
                                    <Form.Label>ราคารวมทั้งหมด</Form.Label>
                                    <Form.Control type="text" placeholder="ราคารวมทั้งหมด" value={totalPrice} readOnly />
                                </Form.Group>
                            </Col>
                            <Col xs={6} className="d-flex align-items-end">
                                <Button variant="secondary" onClick={handleSaveForm}>บันทึก</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Button variant="primary" className="mt-3" onClick={() => setShowPrintModal(true)}>พิมพ์</Button>

                    {/* Print Modal */}
                    <Modal show={showPrintModal} onHide={() => setShowPrintModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>ผลลัพธ์การคำนวณ</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div id="printableContent">
                                <h6>ผลลัพธ์การคำนวณ</h6>
                                <p>วันที่: {new Date().toLocaleDateString()}</p>
                                <p>ชื่อผู้ขาย: {seller}</p>
                                <p>น้ำหนัก: {weight} กก.</p>
                                <p>เปอร์เซ็น: {percentage}%</p>
                                <p>ยางแห้ง: {dryRubber} กก.</p>
                                <p>ราคารวมทั้งหมด: {totalPrice} บาท</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPrintModal(false)}>ปิด</Button>
                            <Button variant="primary" onClick={handlePrint}>พิมพ์</Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Chart Modal */}
                    <Modal show={showChart} onHide={() => setShowChart(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>กราฟแสดงราคา</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PriceChart data={formData} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowChart(false)}>ปิด</Button>
                        </Modal.Footer>
                    </Modal>
                    
                </Col>
            </Row>
        </Container>
    );
}




///////////////////////////////////////////////////////////////////////////////////









// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css'; // ไอคอน Bootstrap
// import { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button, Navbar, Nav, Dropdown } from 'react-bootstrap';
// import './Processbuy.css'; // นำเข้าไฟล์ CSS ที่คุณเพิ่มด้านบน

// export default function Processbuy() {
//     const [price, setPrice] = useState('');
//     const [firstField, setFirstField] = useState(''); // State สำหรับเก็บค่าของช่องแรก
//     const [weight, setWeight] = useState(''); // น้ำหนัก(กก.)
//     const [percentage, setPercentage] = useState(''); // เปอร์เซ็น
//     const [dryRubber, setDryRubber] = useState(''); // ยางแห้ง
//     const [totalPrice, setTotalPrice] = useState(''); // ราคารวมทั้งหมด
//     const [seller, setSeller] = useState(''); // State สำหรับเก็บค่าชื่อผู้ขาย
//     const [formData, setFormData] = useState([]); // State สำหรับเก็บข้อมูลฟอร์ม

//     useEffect(() => {
//         const savedPrice = localStorage.getItem('price');
//         if (savedPrice) {
//             setPrice(savedPrice);
//             setFirstField(savedPrice);
//         }

//         const savedFormData = localStorage.getItem('formData');
//         if (savedFormData) {
//             setFormData(JSON.parse(savedFormData));
//         }
//     }, []);

//     const handleSavePrice = () => {
//         setFirstField(price); // บันทึกค่า price ใน firstField
//         localStorage.setItem('price', price);
//     };

//     const handleCalculate = () => {
//         const dryWeight = (parseFloat(weight) * parseFloat(percentage)) / 100; // คำนวณยางแห้ง
//         setDryRubber(dryWeight.toFixed(2)); // แสดงผลยางแห้ง

//         const total = dryWeight * parseFloat(price); // คำนวณราคารวมทั้งหมด
//         setTotalPrice(total.toFixed(2)); // แสดงผลราคารวมทั้งหมด
//     };

//     const handleSaveForm = () => {
//         const newEntry = {
//             date: new Date().toLocaleDateString(),
//             seller: seller, // ต้องเก็บค่า "ชื่อผู้ขาย" ที่คุณกรอกในฟอร์ม
//             price: firstField,
//             weight,
//             percentage,
//             dryRubber,
//             totalPrice
//         };

//         const updatedFormData = [...formData, newEntry];
//         setFormData(updatedFormData); // เก็บข้อมูลใน state
//         localStorage.setItem('formData', JSON.stringify(updatedFormData)); // บันทึกข้อมูลใน Local Storage
//         console.log(newEntry); // แสดงข้อมูลในคอนโซล
//     };

//     const handlePrint = () => {
//         window.print();
//     };

//     return (
//         <Container fluid>
//             {/* Navbar */}
//             <Navbar className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
//                 <Container>
//                     <Navbar.Brand href="#home">Brand</Navbar.Brand>
//                     <Nav className="me-auto"></Nav>
//                     <Nav>
//                         <Nav.Link href="#contact">ติดต่อเรา</Nav.Link>
//                         <Dropdown align="end">
//                             <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                                 ผู้รับซื้อ
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu>
//                                 <Dropdown.Item href="#profile">ข้อมูลส่วนตัว</Dropdown.Item>
//                                 <Dropdown.Item href="#logout">ออกจากระบบ</Dropdown.Item>
//                             </Dropdown.Menu>
//                         </Dropdown>
//                     </Nav>
//                 </Container>
//             </Navbar>

//             {/* Sidebar */}
//             <Row>
//                 <Col xs={2} style={{ backgroundColor: '#D2B48C', height: '100vh', padding: '0' }}>
//                     <Nav defaultActiveKey="home" className="flex-column p-3" style={{ height: '100%' }} >
//                         <Nav.Link href="home" className="text-white">หน้าแรก</Nav.Link>
//                         <Nav.Link href="processbuy" className="text-white active" >รับซื้อน้ำยางพารา</Nav.Link>
//                         <Nav.Link href="history" className="text-white">ประวัติการรับซื้อ</Nav.Link>
//                         <Nav.Link href="#daily" className="text-white">จัดการข้อมูลรับซื้อรายวัน</Nav.Link>
//                         <Nav.Link href="#results" className="text-white">แสดงผลการรับซื้อ</Nav.Link>
//                     </Nav>
//                 </Col>


//                 {/* Main Content */}
//                 <Col xs={10} style={{ padding: '20px' }}>
//                     <Form>
//                         <Row className="mb-3">
//                             <Col xs={6}>
//                                 <Form.Group controlId="price">
//                                     <Form.Label>ราคารับซื้อวันนี้</Form.Label>
//                                     <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={6}>
//                                 <Form.Label>&nbsp;</Form.Label>
//                                 <div>
//                                     <Button variant="secondary" className="me-2" onClick={handleSavePrice}>บันทึก</Button>
//                                     <Button variant="danger">แสดงกราฟ</Button>
//                                 </div>
//                             </Col>
//                         </Row>
//                     </Form>

//                     <h6>กรุณากรอกข้อมูลการรับซื้อน้ำยางสดเพื่อนำไปคำนวณราคา</h6>
//                     <Form className="printableArea">
//                         <Row className="mb-3">
//                             <Col>
//                                 <Form.Label>วัน/เดือน/ปี</Form.Label>
//                                 <Form.Control type="text" placeholder="ว/ด/ป" readOnly value={new Date().toLocaleDateString()} />
//                             </Col>
//                             <Col>
//                                 <Form.Label>ชื่อผู้ขาย</Form.Label>
//                                 <Form.Control type="text" placeholder="ชื่อผู้ขาย" onChange={(e) => setSeller(e.target.value)} />
//                             </Col>
//                             <Col>
//                                 <Form.Label>ราคา(บาท.)</Form.Label>
//                                 <Form.Control type="text" placeholder="ราคา" value={firstField} readOnly />
//                             </Col>
//                         </Row>
//                         <Row className="mb-3">
//                             <Col>
//                                 <Form.Label>น้ำหนัก(กก.)</Form.Label>
//                                 <Form.Control type="text" placeholder="น้ำหนัก(กก.)" value={weight} onChange={(e) => setWeight(e.target.value)} />
//                             </Col>
//                             <Col>
//                                 <Form.Label>เปอร์เซ็น</Form.Label>
//                                 <Form.Control type="text" placeholder="เปอร์เซ็น" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
//                             </Col>
//                             <Col>
//                                 <Form.Label>ยางแห้ง</Form.Label>
//                                 <Form.Control type="text" placeholder="ยางแห้ง" value={dryRubber} readOnly />
//                             </Col>
//                         </Row>

//                         <Col xs={6} className="d-flex align-items-end">
//                             <Button variant="secondary" onClick={handleCalculate}>คิดเงิน</Button>
//                         </Col>
    
//                         <Row>
//                             <Col xs={6}>
//                                 <Form.Group controlId="totalPrice">
//                                     <Form.Label>ราคารวมทั้งหมด</Form.Label>
//                                     <Form.Control type="text" placeholder="ราคารวมทั้งหมด" value={totalPrice} readOnly />
//                                 </Form.Group>
//                             </Col>
//                             <Col xs={6} className="d-flex align-items-end">
//                                 <Button variant="secondary" onClick={handleSaveForm}>บันทึก</Button>
//                             </Col>
//                         </Row>
//                     </Form>

//                     <Button variant="primary" className="mt-3" onClick={handlePrint}>พิมพ์</Button>

//                     {/* <div className="mt-3">
//                         <h6>ประวัติการรับซื้อ</h6>
//                         <ul>
//                             {formData.map((entry, index) => (
//                                 <li key={index}>
//                                     {entry.date} - {entry.seller} - {entry.weight} กก. - {entry.percentage}% - {entry.dryRubber} กก. - {entry.totalPrice} บาท
//                                 </li>
//                             ))}
//                         </ul>
//                     </div> */}
//                 </Col>
//             </Row>
//         </Container>
//     );
// }
