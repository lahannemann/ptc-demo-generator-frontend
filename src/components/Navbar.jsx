import { NavLink } from "react-router-dom";
import "./navbar.css"; // new small file just for NavBar styles

export default function NavBar() {
  return (
    <nav className="nav-vertical" aria-label="Primary">
      <ul>
        <li><NavLink to="/" end>Setup Connection</NavLink></li>
        <li><NavLink to="/GenerateItems">Generate Items</NavLink></li>
        <li><NavLink to="/GenerateTraceability">Generate Traceability</NavLink></li>
        <li><NavLink to="/UpdateItemStatuses">Update Item Statuses</NavLink></li>
        <li><NavLink to="/UpdateItemMetadata">Update Item Metadata</NavLink></li>
        <li><NavLink to="/TestRunGenerator">Test Run Generator</NavLink></li>
        <li><NavLink to="/GenerateTestSteps">Generate Test Steps</NavLink></li>
        <li><NavLink to="/DeleteAllProjectData">Delete All Project Data</NavLink></li>
        <li><NavLink to="/DeleteAllTrackerData">Delete All Tracker Data</NavLink></li>
        <li><NavLink to="/BatchItemGenerator">Batch Item Generator</NavLink></li>
      </ul>
    </nav>
  );
}