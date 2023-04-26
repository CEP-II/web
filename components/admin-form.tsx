import axios from "axios";
import { Formik, Form, Field, FormikHelpers, FormikProps } from "formik";
import { Variables } from "../data/globalVariable";
import Cookies from 'js-cookie';
import '../components/admin-form.module.css'


//


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
        //make a pop up window to confirm the user creation
        if (confirm("Are you sure you want to create this user?")) {
            //send the post request to the backend to create a new user in the database
            //send the token in the header to make sure the user is logged in

            //print the values from the form in console
            console.log(values.username);
            
            
            }
        }
        /*
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
        */
    

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

    //this function will reset the form

    const resetForm = (formikProps: any) => {
        formikProps.resetForm();
      };
      
      

    return (
        <div className="container">
                
            <div>
                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                        phoneNumber: "",
                        email: "",
                        firstName: "",
                        lastName: "",
                        address: "",
                    }}
                    
                    onSubmit={createUser}
                    
                >
                {(formikProps) => (
                <div style={{position: 'absolute', top: '10px' , left: '10px' , padding: '10px'}}>
                    <Form>
                        <h1 className="display-6 mb-3">Create user</h1>

                        <div className="input-field mb-2">
                            <Field id="username" name="username" placeholder="Username" />
                        </div>

                        <div className="mb-2">
                            <Field id="password" name="password" placeholder="Password" type="password" />
                        </div>

                        <div className="mb-2">
            
                            <Field id="firstName" name="firstName" placeholder="First Name" />
                        </div>
        
                        <div className="mb-2">
                            <Field id="lastName" name="lastName" placeholder="Last Name" />
                        </div>

                        <div className="mb-2">
                            <Field id="email" name="email" placeholder="Email" />
                        </div>

                        <div className="mb-2">
                            <Field id="phoneNumber" name="phoneNumber" placeholder="Phone Number" />
                        </div>
        
                        <div className="mb-2">
                            <Field id="address" name="address" placeholder="Address" />
                        </div>

                        <div>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '5px 10px', marginRight: '5px', width: '100px' }}  >Create User</button>
                            <button type="button" className="btn btn-primary" style={{ fontSize: '12px', padding: '5px 10px' }} onClick={() => resetForm(formikProps)}>Clear Fields</button>
                        </div>
                    </Form>
                </div>
                )}
                </Formik>
            </div>

            <div style={{position: 'absolute', top: '15px', right: '10px', padding: '10px'}}>
                <button type="button" className="btn btn-primary" style={{ fontSize: '14px', padding: '5px 10px', marginRight: '5px'}} onClick={() => {
                window.location.href = '/showData';
                }}>data</button>
                    
                <button type="button" className="btn btn-primary" style={{fontSize: '14px', padding: '5px 10px'}} onClick={() => {
                Cookies.remove('token');
                window.location.href = '/';
                }}>Log out</button>
            </div>

        </div>
        );
    }
    