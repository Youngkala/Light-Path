import { Route, Switch } from "wouter";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

/**
 * AuthStack - Navigation for unauthenticated users
 * Contains: Login, Signup, Password Reset screens
 */
export default function AuthStack() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          {/* Default to login for unauthenticated users */}
          <Route path="/" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}
