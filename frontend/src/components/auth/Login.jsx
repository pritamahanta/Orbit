import axios from "axios";
import React, { useEffect } from "react";
import NavBar from "../shared/NavBar.jsx";
import { Label } from "../ui/label.jsx";
import { Input } from "../ui/input.jsx";
import { RadioGroup } from "../ui/radio-group.jsx";
import { Button } from "../ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { USER_API_END_POINT } from "../../utils/constants.js"; // wherever you keep it
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice.js";
import { Loader2 } from "lucide-react";
console.log(USER_API_END_POINT);

export const Login = () => {

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: ""
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector(store => store.auth);


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch((setUser(res.data.user)));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    finally {
      dispatch(setLoading(false));
    }
  }
  useEffect(() => {
    if(user) {
      navigate('/') ;
    }
  }, []) ;

  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="flex text-bold text-xl justify-center mb-5">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-xl p-4 my-10">
          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2">
            <Label className="my-2">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="email" />
          </div>

          <div className="my-2">
            <Label className="my-2">Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Password" />
          </div>

          <div className="flex justify-between">

            <RadioGroup className="flex justify-between my-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {
            loading ?
              (
                <Button disabled className="w-full bg-[#cc1212] hover:bg-[#030101]"> <Loader2 className=" h-4 w-4 animate-spin" /> Please wait</Button>
              )
              :
              (
                <Button type="submit" className="w-full bg-[#cc1212] hover:bg-[#030101]">Login</Button>
              )
          }
          <span className="text-sm my-2"> Don't have an account?
            <Link to="/signup" className="mx-2 text-blue-600"> Signup </Link>
          </span>
        </form>
      </div>
    </>
  );
};
