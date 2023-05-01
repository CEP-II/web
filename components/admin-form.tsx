import axios from "axios";
import { Formik, Form, Field, FormikHelpers, FormikProps } from "formik";
import { Variables } from "../data/globalVariable";
import Cookies from 'js-cookie';
import '../components/admin-form.module.css'



//


interface Values {
    password: string;
    phoneNumber : string;
    email : string;
    name : string;
    postal : string;
    street : string;
    city : string;
    birthDate : string;
}



export default function AdminForm() 
{
    //this function will create a new user in the database

    const createUser = (values: Values, { setSubmitting }: FormikHelpers<Values>) => 
        {
            //make a pop up window to confirm the user creation
            if (confirm("Are you sure you want to create this user?")) 
            {   
                const address = {
                    postal : values.postal,
                    street : values.street,
                    city : values.city,
                }
                


                //converts the date from string to Date format
                const date = Date.now()

                //const number = parseInt(values.phoneNumber)
                //console.log(number)
                
                
                //send the post request to the backend to create a new user in the database
                //send the token in the header to make sure the user is logged in
                axios.post(Variables.API_URL + '/citizen/signup', {
                    //token is saved in the cookie and send in the header
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                    //send the values from the form to the backend
                    password: values.password,
                    phone : values.phoneNumber,
                    email : values.email,
                    name : values.name,
                    address : address,
                    birthdate : date,
                })
                //if the user is created successfully we get a message
                .then(response => {console.log(response.data.message)})
                .catch(error => {console.error(error);});
            }
        }
        const resetForm = (formikProps: any) => {
            formikProps.resetForm();
        };
    



        
    
      
      

    return (
        <div className="container">
                
            <div>
                <Formik
                    initialValues={{
                        password: "",
                        phoneNumber: "",
                        email: "",
                        name: "",
                        city: "",
                        street: "",
                        postal: "",
                        birthDate: "",
                    }}
                    
                    onSubmit={createUser}
                    
                >
                {(formikProps) => (
                <div style={{position: 'absolute', top: '10px' , left: '10px' , padding: '10px'}}>
                    <Form>
                        <h1 className="display-6 mb-3">Create user</h1>

                        <div className="mb-2">
                            <Field id="password" name="password" placeholder="Password" type="password" />
                        </div>

                        <div className="mb-2">
                            <Field id="name" name="name" placeholder="Name" />
                        </div>

                        <div className="mb-2">
                            <Field id="email" name="email" placeholder="Email" />
                        </div>

                        <div className="mb-2">
                            <Field id="phoneNumber" name="phoneNumber" placeholder="Phone Number" />
                        </div>

                        <div className="mb-2">
                            <Field id="birthDate" name="birthDate" placeholder="Birth Date" />
                        </div>

                        <div className="mb-2">
                            <Field id="city" name="city" placeholder="City" />
                        </div>

                        <div className="mb-2">
                            <Field id="street" name="street" placeholder="Street" />
                        </div>

                        <div className="mb-2">
                            <Field id="postal" name="postal" placeholder="Postal" />
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
    