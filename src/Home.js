import { Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
    // if (localStorage.getItem("access_token")) {
    //     console.log(localStorage.getItem("access_token"));

        return (

    <div>
        
     <nav className="navbar border-bottom border-body" style={{ backgroundColor: '#997950' }} data-bs-theme="dark">
    {/* <nav className="navbar bg-info border-bottom border-body" data-bs-theme="dark"> */}
    {/* <nav className="navbar" style={{background-color: "#e3f2fd"}}> */}
        <button type="button" className="btn btn-secondary btn-lg ms-auto">ติดต่อเรา</button>
        <i className="bi bi-person-circle" style={{ color: 'Black', fontSize: '40px', marginInline: '30px' }}></i>
    </nav>

    <div class="p-3 mb-2  text-white"style={{ backgroundColor: '#D2B48C' }}>
    <div className="container text-center mt-5">
        <h4>ยินดีต้อนรับเข้าสู่หน้าเว็บไซต์ของผู้รับซื้อน้ำยางสด</h4>
        <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
                <div className="card" style={{ width: '20rem' }}>
                <img src="images/รับซื้อ.png" className="card-img-top" alt="รับซื้อน้ำยางพารา" />
                    <div className="card-body">
                        <h5 className="card-title">รับซื้อน้ำยางพารา</h5>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <a href="Processbuy" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card" style={{ width: '20rem' }}>
                    <img src="images/ประวัติการรับซื้อ.png" className="card-img-top" alt="ประวัติการรับซื้อ" />
                    <div className="card-body">
                        <h5 className="card-title">ประวัติการรับซื้อ</h5>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <a href="History" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card" style={{ width: '20rem' }}>
                <img src="images/ตั้งค่า.png" className="card-img-top" alt="จัดการข้อมูลรับซื้อรายวัน" />
                    <div className="card-body">
                        <h5 className="card-title">จัดการข้อมูลรับซื้อรายวัน</h5>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card" style={{ width: '20rem'}}>
                <img src="images/แสดงผลการรับซื้อ.jpg" className="card-img-top" alt="แสดงผลการรับซื้อ" />
                    <div className="card-body">
                        <h5 className="card-title">แสดงผลการรับซื้อ</h5>
                        {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>   

        );
    }

    // return (
        <Navigate to="/" replace />
//     );
// }




//////////////////////

// export default function Home() {
//     return(
//         <>สวัสดีทำไรเป็นบ้างนิแพร</>
//     );
// }