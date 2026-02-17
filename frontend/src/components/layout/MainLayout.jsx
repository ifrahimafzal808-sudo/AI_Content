import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function MainLayout() {
    return (
        <div className="main-layout">
            <Navbar />
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
