
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import ProblemDetails from "./pages/ProblemDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProblem from "./pages/CreateProblem";
import AskerDashboard from "./pages/AskerDashBoard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

 <Route  path="/explore" element={  <ProtectedRoute>
                            <Explore />
                        </ProtectedRoute>
                    }
                />

       <Route path="/problems/:id" element={
                        <ProtectedRoute>
                            <ProblemDetails />
                        </ProtectedRoute>
                    }
                />
 <Route path="/create-problem"  element={
                        <ProtectedRoute>
                            <CreateProblem />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/asker"
                    element={
                        <ProtectedRoute>
                            <AskerDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
