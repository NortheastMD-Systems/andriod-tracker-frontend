import React, {useState} from 'react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const formSchema = Yup.object().shape({
    userid: Yup.string()
        .required("Required"),
     sku:Yup.string().required("Required")
})


export default () => {
    const [serverState,setServerState] = useState()
    const [signOut,setSignOut] = useState([])
    const handleServerResponse = (ok,msg) => {
        setServerState({ok,msg})
    }
    const handleOnSubmit = (values, actions) => {
       
        axios({
            method:"POST",
            url:"https://scanner-logs.herokuapp.com/db/logs/checkout"
            ,data:values
        })
        .then(response => {
             setSignOut({userid:values.userid,sku:values.sku,signOutid:response.data.logs[0]})
           localStorage.setItem("LOGID",response.data.logs[0])
            actions.setSubmitting(false)
            actions.resetForm()
            handleServerResponse(true, "Scanner Successfully Signed Out!!!")

        })
        .catch(error => {
            actions.setSubmitting(false)
            handleServerResponse(false,error.response.data.error)
        })
    }
console.log(signOut)
    return (
        <div>
            <h1>Scanner Sign Out</h1>
            <Formik 
                initialValues={{userid:"",sku:""}}
                onSubmit={handleOnSubmit}
                validationSchema={formSchema}>
                     {({ isSubmitting }) => (
              <Form id="fs-frm" noValidate>
                <label htmlFor="userid">User Id:</label>
                <Field id="userid" type="string" name="userid" />
                <ErrorMessage name="userid" className="errorMsg" component="p" />
                <label htmlFor="sku">Scanner Sku:</label>
                <Field id="sku" name="sku"/>
                <ErrorMessage name="sku" className="errorMsg" component="p" />
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
                {serverState && (
                  <p className={!serverState.ok ? "errorMsg" : ""}>
                    {serverState.msg}
                  </p>
                )}
              </Form>
            )}
                </Formik>
        </div>
    )
}