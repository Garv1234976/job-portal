import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login_id: sessionStorage.getItem("login_id") || "",
    role: "",
    otp_type: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔹 OTP INPUT CHANGE
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // 🔹 PASTE OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const match = paste.match(/\d{6}/);
    if (match) setOtp(match[0].split(""));
  };

  // 🔹 TIMER
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // 🔹 VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!form.login_id) newErrors.login_id = "Login ID is required";
    if (!form.role) newErrors.role = "Please select role";
    if (!form.otp_type) newErrors.otp_type = "Please select OTP method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/send-otp", {
        login_id: form.login_id,
        otp_type: form.otp_type,
      });

      Swal.fire("Success", "OTP sent", "success");

      setShowOtp(true);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SEND OTP
  const handleResendOtp = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/resend-otp", {
        login_id: form.login_id,
        otp_type: form.otp_type,
      });

      Swal.fire("Success", "OTP Resent", "success");

      setShowOtp(true);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      Swal.fire("Error", "Enter 6 digit OTP", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/verify-otp", {
        login_id: form.login_id,
        otp: finalOtp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
      });
      sessionStorage.removeItem("login_id");
      setTimeout(() => {
        navigate(
          res.data.role === "candidate"
            ? "/candidate/dashboard"
            : "/recruiter/dashboard",
        );
      }, 1500);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* Role */}
        <div className="mb-2">
          <label className="form-label">
            Login As <span className="text-danger">*</span>
          </label>
          <select
            name="role"
            onChange={handleChange}
            className={`form-control ${errors.role ? "is-invalid" : ""}`}
          >
            <option value="">Select Role</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
          {errors.role && <small className="text-danger">{errors.role}</small>}
        </div>

        {/* Login ID */}
        <div className="mb-2">
          <label className="form-label">
            Login ID <span className="text-danger">*</span>
          </label>
          <input
            name="login_id"
            value={form.login_id} 
            placeholder="Enter Login ID"
            className={`form-control ${errors.login_id ? "is-invalid" : ""}`}
            onChange={handleChange}
          />
          {errors.login_id && (
            <small className="text-danger">{errors.login_id}</small>
          )}
        </div>

        {/* OTP Type */}
        <div className="mb-2">
          <label className="form-label">
            Receive OTP via <span className="text-danger">*</span>
          </label>

          <div className="d-flex gap-3 mt-1">
            <label>
              <input
                type="radio"
                name="otp_type"
                value="email"
                onChange={handleChange}
              />{" "}
              Email
            </label>

            <label>
              <input
                type="radio"
                name="otp_type"
                value="phone"
                onChange={handleChange}
              />{" "}
              Phone
            </label>
          </div>

          {errors.otp_type && (
            <small className="text-danger">{errors.otp_type}</small>
          )}
        </div>

        {!showOtp && (
          <button onClick={handleSendOtp} className="btn btn-primary w-100">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {showOtp && (
          <>
            {/* OTP BOXES */}
            <div
              className="d-flex justify-content-between mt-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="form-control text-center"
                  style={{ width: "40px", fontSize: "20px" }}
                />
              ))}
            </div>

            {/* VERIFY */}
            <button
              className="btn btn-success w-100 mt-3"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND */}
            <div className="text-center mt-2">
              {!canResend ? (
                <small>Resend in {timer}s</small>
              ) : (
                <button className="btn btn-link" onClick={handleResendOtp}>
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
        <div className="text-center mt-3">
          If you have an account?{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register/candidate")}
          >
            Registration here
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
