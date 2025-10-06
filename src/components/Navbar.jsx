import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {

   
    const linkClass = ({ isActive }) => (isActive? 'link active':'link');

    return (
        <header className="nav">
            <div className="nav_bar">

                {/* Desktop links */}
                <nav className="nav_links desktop">
                    <NavLink to="/" end className={linkClass}>Setup Connection</NavLink>
                    <NavLink to="/GenerateItems" className={linkClass}>Generate Items</NavLink>
                    <NavLink to="/GenerateTraceability" className={linkClass}>Generate Traceability</NavLink>
                    <NavLink to="/UpdateItemStatuses" className={linkClass}>Update Item Statuses</NavLink>
                    <NavLink to="/UpdateItemMetadata" className={linkClass}>Update Item Metadata</NavLink>
                    <NavLink to="/TestRunGenerator" className={linkClass}>Test Run Generator</NavLink>
                    <NavLink to="/GenerateTestSteps" className={linkClass}>Generate Test Steps</NavLink>
                    <NavLink to="/DeleteAllProjectData" className={linkClass}>Delete All Project Data</NavLink>
                    <NavLink to="/DeleteAllTrackerData" className={linkClass}>Delete All Tracker Data</NavLink>
                    <NavLink to="/BatchItemGenerator" className={linkClass}>Batch Item Generator</NavLink>
                </nav>
            </div>
        </header>
    );

}

export default Navbar;