import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Form, Table } from 'react-bootstrap';
import axios from 'axios';

export default function History() {
    const [price, setPrice] = useState('');
    const [firstField, setFirstField] = useState('');
    const [weight, setWeight] = useState('');
    const [percentage, setPercentage] = useState('');
    const [dryRubber, setDryRubber] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [seller, setSeller] = useState('');
    const [formData, setFormData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');

    useEffect(() => {
        const savedPrice = localStorage.getItem('price');
        if (savedPrice) {
            setPrice(savedPrice);
            setFirstField(savedPrice);
        }

        fetchFormData();
    }, []);

    const fetchFormData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/getHistory');
            // แปลงวันที่ที่ได้รับจาก API เป็นรูปแบบที่ไม่รวมเวลา
            const dataWithFormattedDates = response.data.map(entry => ({
                ...entry,
                date: new Date(entry.date).toLocaleDateString('th-TH') // แปลงวันที่
            }));
            setFormData(dataWithFormattedDates);
        } catch (error) {
            console.error('Error fetching form data:', error);
        }
    };

    const handleSavePrice = () => {
        setFirstField(price);
        localStorage.setItem('price', price);
    };

    const handleCalculate = () => {
        const dryWeight = (parseFloat(weight) * parseFloat(percentage)) / 100;
        setDryRubber(dryWeight.toFixed(2));

        const total = dryWeight * parseFloat(price);
        setTotalPrice(total.toFixed(2));
    };

    const handleSaveForm = async () => {
        const newEntry = {
            date: new Date().toLocaleDateString('th-TH'), // ใช้ 'th-TH' เพื่อแสดงวันที่ตามเวลาไทย
            seller,
            price: firstField,
            weight,
            percentage,
            dryRubber,
            totalPrice
        };

        try {
            await axios.post('http://localhost:8080/api/saveForm', newEntry);
            setFormData([...formData, newEntry]);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const filterData = () => {
        return formData.filter(entry => {
            const entryDate = entry.date; // วันที่ที่เก็บใน formData แล้ว
            const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('th-TH');
            const isDateMatch = selectedDate ? entryDate === formattedSelectedDate : true;
            const isSellerMatch = selectedSeller ? entry.seller === selectedSeller : true;
            return isDateMatch && isSellerMatch;
        });
    };

    const sellers = [...new Set(formData.map(entry => entry.seller))];

    return (
        <Container>
            <Navbar className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
                <Navbar.Brand>History</Navbar.Brand>
            </Navbar>
            <h3 className="mt-3">History</h3>
            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Select Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Select Seller</Form.Label>
                        <Form.Select
                            value={selectedSeller}
                            onChange={e => setSelectedSeller(e.target.value)}
                        >
                            <option value="">All Sellers</option>
                            {sellers.map((seller, index) => (
                                <option key={index} value={seller}>{seller}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Seller</th>
                        <th>Weight (kg)</th>
                        <th>Percentage (%)</th>
                        <th>Dry Rubber (kg)</th>
                        <th>Total Price (THB)</th>
                    </tr>
                </thead>
                <tbody>
                    {filterData().map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{entry.seller}</td>
                            <td>{entry.weight}</td>
                            <td>{entry.percentage}</td>
                            <td>{entry.dryRubber}</td>
                            <td>{entry.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}





////////////////////////////////////////////
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useEffect, useState } from 'react';
// import { Container, Row, Col, Navbar, Form, Table } from 'react-bootstrap';

// export default function History() {
//     const [price, setPrice] = useState('');
//     const [firstField, setFirstField] = useState('');
//     const [weight, setWeight] = useState('');
//     const [percentage, setPercentage] = useState('');
//     const [dryRubber, setDryRubber] = useState('');
//     const [totalPrice, setTotalPrice] = useState('');
//     const [seller, setSeller] = useState('');
//     const [formData, setFormData] = useState([]);
//     const [selectedDate, setSelectedDate] = useState('');
//     const [selectedSeller, setSelectedSeller] = useState('');

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
//         setFirstField(price);
//         localStorage.setItem('price', price);
//     };

//     const handleCalculate = () => {
//         const dryWeight = (parseFloat(weight) * parseFloat(percentage)) / 100;
//         setDryRubber(dryWeight.toFixed(2));

//         const total = dryWeight * parseFloat(price);
//         setTotalPrice(total.toFixed(2));
//     };

//     const handleSaveForm = () => {
//         const newEntry = {
//             date: new Date().toLocaleDateString(),
//             seller,
//             price: firstField,
//             weight,
//             percentage,
//             dryRubber,
//             totalPrice
//         };

//         const updatedFormData = [...formData, newEntry];
//         setFormData(updatedFormData);
//         localStorage.setItem('formData', JSON.stringify(updatedFormData));
//     };

//     const filterData = () => {
//         return formData.filter(entry => {
//             const entryDate = new Date(entry.date);
//             const isDateMatch = selectedDate ? entryDate.toLocaleDateString() === new Date(selectedDate).toLocaleDateString() : true;
//             const isSellerMatch = selectedSeller ? entry.seller === selectedSeller : true;
//             return isDateMatch && isSellerMatch;
//         });
//     };

//     const sellers = [...new Set(formData.map(entry => entry.seller))];

//     return (
//         <Container>
//             <Navbar className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
//                 <Navbar.Brand>History</Navbar.Brand>
//             </Navbar>
//             <h3 className="mt-3">History</h3>
//             <Form>
//                 <Row className="mb-3">
//                     <Col>
//                         <Form.Label>Select Date</Form.Label>
//                         <Form.Control
//                             type="date"
//                             value={selectedDate}
//                             onChange={e => setSelectedDate(e.target.value)}
//                         />
//                     </Col>
//                     <Col>
//                         <Form.Label>Select Seller</Form.Label>
//                         <Form.Select
//                             value={selectedSeller}
//                             onChange={e => setSelectedSeller(e.target.value)}
//                         >
//                             <option value="">All Sellers</option>
//                             {sellers.map((seller, index) => (
//                                 <option key={index} value={seller}>{seller}</option>
//                             ))}
//                         </Form.Select>
//                     </Col>
//                 </Row>
//             </Form>
//             <Table striped bordered hover className="mt-3">
//                 <thead>
//                     <tr>
//                         <th>Date</th>
//                         <th>Seller</th>
//                         <th>Weight (kg)</th>
//                         <th>Percentage (%)</th>
//                         <th>Dry Rubber (kg)</th>
//                         <th>Total Price (THB)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filterData().map((entry, index) => (
//                         <tr key={index}>
//                             <td>{entry.date}</td>
//                             <td>{entry.seller}</td>
//                             <td>{entry.weight}</td>
//                             <td>{entry.percentage}</td>
//                             <td>{entry.dryRubber}</td>
//                             <td>{entry.totalPrice}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </Container>
//     );
// }


/////////////////////////////////////////////////////////


// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { useEffect, useState } from 'react';
// import { Container, Row, Col, Navbar, Form, Table, Button } from 'react-bootstrap';

// export default function History() {
//     const [price, setPrice] = useState('');
//     const [firstField, setFirstField] = useState('');
//     const [weight, setWeight] = useState('');
//     const [percentage, setPercentage] = useState('');
//     const [dryRubber, setDryRubber] = useState('');
//     const [totalPrice, setTotalPrice] = useState('');
//     const [seller, setSeller] = useState('');
//     const [formData, setFormData] = useState([]);
//     const [selectedDate, setSelectedDate] = useState('');
//     const [selectedSeller, setSelectedSeller] = useState('');

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
//         setFirstField(price);
//         localStorage.setItem('price', price);
//     };

//     const handleCalculate = () => {
//         const dryWeight = (parseFloat(weight) * parseFloat(percentage)) / 100;
//         setDryRubber(dryWeight.toFixed(2));

//         const total = dryWeight * parseFloat(price);
//         setTotalPrice(total.toFixed(2));
//     };

//     const handleSaveForm = () => {
//         const newEntry = {
//             date: new Date().toLocaleDateString(),
//             seller,
//             price: firstField,
//             weight,
//             percentage,
//             dryRubber,
//             totalPrice
//         };

//         const updatedFormData = [...formData, newEntry];
//         setFormData(updatedFormData);
//         localStorage.setItem('formData', JSON.stringify(updatedFormData));
//     };

//     const handleClearData = () => {
//         localStorage.removeItem('price');
//         localStorage.removeItem('formData');
//         setPrice('');
//         setFirstField('');
//         setWeight('');
//         setPercentage('');
//         setDryRubber('');
//         setTotalPrice('');
//         setSeller('');
//         setFormData([]);
//     };

//     const filterData = () => {
//         return formData.filter(entry => {
//             const entryDate = new Date(entry.date);
//             const isDateMatch = selectedDate ? entryDate.toLocaleDateString() === new Date(selectedDate).toLocaleDateString() : true;
//             const isSellerMatch = selectedSeller ? entry.seller === selectedSeller : true;
//             return isDateMatch && isSellerMatch;
//         });
//     };

//     const sellers = [...new Set(formData.map(entry => entry.seller))];

//     return (
//         <Container>
//             <Navbar className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
//                 <Navbar.Brand>History</Navbar.Brand>
//             </Navbar>
//             <h3 className="mt-3">History</h3>
//             <Button variant="danger" onClick={handleClearData} className="mb-3">
//                 Clear All Data
//             </Button>
//             <Form>
//                 <Row className="mb-3">
//                     <Col>
//                         <Form.Label>Select Date</Form.Label>
//                         <Form.Control
//                             type="date"
//                             value={selectedDate}
//                             onChange={e => setSelectedDate(e.target.value)}
//                         />
//                     </Col>
//                     <Col>
//                         <Form.Label>Select Seller</Form.Label>
//                         <Form.Select
//                             value={selectedSeller}
//                             onChange={e => setSelectedSeller(e.target.value)}
//                         >
//                             <option value="">All Sellers</option>
//                             {sellers.map((seller, index) => (
//                                 <option key={index} value={seller}>{seller}</option>
//                             ))}
//                         </Form.Select>
//                     </Col>
//                 </Row>
//             </Form>
//             <Table striped bordered hover className="mt-3">
//                 <thead>
//                     <tr>
//                         <th>Date</th>
//                         <th>Seller</th>
//                         <th>Weight (kg)</th>
//                         <th>Percentage (%)</th>
//                         <th>Dry Rubber (kg)</th>
//                         <th>Total Price (THB)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filterData().map((entry, index) => (
//                         <tr key={index}>
//                             <td>{entry.date}</td>
//                             <td>{entry.seller}</td>
//                             <td>{entry.weight}</td>
//                             <td>{entry.percentage}</td>
//                             <td>{entry.dryRubber}</td>
//                             <td>{entry.totalPrice}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>
//         </Container>
//     );
// }
