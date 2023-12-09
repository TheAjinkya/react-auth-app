import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function actions({ request }) {

  const searchParams = new URL(request.url).searchParams
  const data = await request.formData()
  const mode = searchParams.get("mode") || "login"

  if (mode !== 'login' || mode !== "signup") {
    throw json({ message: "unsupported format" }, { status: 422 })
  }

  const authData = {
    email: data.get("email"),
    password: data.get("password")
  }

  const responseData = await fetch("https:localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(authData)
  })

  if (responseData.status === 422 || responseData.status === 401) {
    return responseData;
  }
  if (!responseData.ok) {
    throw json({message: "Could not authenticate user"}, {status:500});
  }
  return redirect("/")
}