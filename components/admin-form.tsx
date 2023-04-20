import axios from "axios";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Variables } from "../data/globalVariable";
import Cookies from 'js-cookie';


interface Values {
    username: string;
    password: string;

    phoneNumber : string;
    email : string;
    firstName : string;
    lastName : string;
    address : string;

}

export default function AdminForm() {
    //this function will create a new user in the database

    const createUser = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        //send the post request to the backend to create a new user in the database
        //send the token in the header to make sure the user is logged in
        axios.post(Variables.API_URL + '/users', {
            //token is saved in the cookie and send in the header
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
            //send the values from the form to the backend
            username: values.username,
            password: values.password,
            phoneNumber : values.phoneNumber,
            email : values.email,
            firstName : values.firstName,
            lastName : values.lastName,
            address : values.address,
        })
        //if the user is created successfully we get a message
        .then(response => {
            console.log(response.data.message)
        }
        )
        .catch(error => {
            console.error(error);
        });
    }

    /*
    //this function will fetch the users from the database
    //and display them in the table
    const fetchUsers = () => {
        //send the get request to the backend to get the users from the database
        //send the token in the header to make sure the user is logged in
        axios.get(Variables.API_URL + '/users', {
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            }
        })
        //if the users are fetched successfully we get a list of users
        .then(response => {
            //display the users in the table
        })
    }
    */

    return (
        <div>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    phoneNumber : "",
                    email : "",
                    firstName : "",
                    lastName : "",
                    address : "",
                }}
                onSubmit={createUser}
            >
                <Form>
                    <label htmlFor="username">Username</label>
                    <Field id="username" name="username" placeholder="Username" />
                    
                    <label htmlFor="password">Password</label>
                    <Field id="password" name="password" placeholder="Password" />

                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Field id="phoneNumber" name="phoneNumber" placeholder="Phone Number" />

                    <label htmlFor="email">Email</label>
                    <Field id="email" name="email" placeholder="Email" />

                    <label htmlFor="firstName">First Name</label>
                    <Field id="firstName" name="firstName" placeholder="First Name" />

                    <label htmlFor="lastName">Last Name</label>
                    <Field id="lastName" name="lastName" placeholder="Last Name" />

                    <label htmlFor="address">Address</label>
                    <Field id="address" name="address" placeholder="Address" />

                    <button type="submit">Create User</button>
                </Form>
            </Formik>
        </div>
    )
}


                    
                
        //

