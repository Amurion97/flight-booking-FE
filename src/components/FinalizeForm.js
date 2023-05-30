import {useEffect, useState} from 'react';
import {createSearchParams, useNavigate} from 'react-router-dom';
// @mui
import {
    FormControlLabel,
    Radio,
    InputLabel,
    MenuItem,
    FormControl,
    Grid,
    Button,
    DialogTitle,
    DialogContent, DialogActions, DialogContentText, Dialog, Box,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {styled, useTheme} from "@mui/material/styles";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import MuiTextField from '@mui/material/TextField';
import {ErrorMessage, Field, Form, Formik, useFormik} from "formik";
import * as yup from 'yup';
import {
    Autocomplete,
    TextField,
    Select,
    RadioGroup,
} from 'formik-mui';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {fetchFlights} from "../features/flight/flightSlice";
import {useDispatch, useSelector} from "react-redux";
import UpperCasingTextField from "./UpperCasingTextField";
import Ticket from "./Ticket";
import IdentityForm from "./IdentityForm";
import {selectDepartureSeats} from "../features/seat/SeatSlice";
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// components

const StyledContent = styled('div')(({theme}) => ({
    display: 'flex',
    width: "100%",
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: "15px 25px 25px",
    borderRadius: "4px"
}));
const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});
// ----------------------------------------------------------------------

export default function FinalizeForm(props) {
    const navigate = useNavigate();
    const theme = useTheme();
    const departure = useSelector(selectDepartureSeats)
    console.log("departure:", departure)
    return (
        <>
            <StyledContent>
                <Formik
                    initialValues={{}}
                    validate={(values) => {
                        const errors = {};
                        if (!values["email-1"]) {
                            errors["email-1"] = 'Required';
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                        ) {
                            errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        console.log("trying to submit:", values)
                    }}
                >
                    {({values, submitForm, resetForm, isSubmitting, touched, errors, setFieldValue}) => {
                        props.pullChildFunc(submitForm)
                        return (
                            <Form>
                                <p>{JSON.stringify(values)}</p>
                                <Grid container spacing={{xs: 1, md: 2}}
                                      style={{
                                          display: (props.activeStep == 0) ? "flex" : "none"
                                      }}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <p>Booking person's contact information</p>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Field
                                            component={TextField}
                                            type="text"
                                            label="Full Name"
                                            name="fullName"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Field
                                            component={UpperCasingTextField}
                                            name={`email`}
                                            type="email"
                                            label="Email"
                                            helperText="Please Enter Email to receive booking confirmation"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6}>
                                        <Field
                                            component={TextField}
                                            name={`phone`}
                                            type="text"
                                            label="Phone Number"
                                            helperText="Please Enter Phone Number for contact"
                                            fullWidth
                                        />
                                    </Grid>
                                    {departure.seats.map((item, index) => (
                                        <Grid item xs={12} sm={12} md={12}>
                                            <IdentityForm activeStep={props.activeStep}
                                                          name={item.name}
                                                          setFieldValue={setFieldValue}
                                                          index={index}>
                                            </IdentityForm>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Grid container spacing={{xs: 1, md: 2}}
                                      style={{
                                          display: (props.activeStep == 1) ? "flex" : "none"
                                      }}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <p>Please make sure the tickets details are correct!</p>
                                    </Grid>
                                    {departure.seats.map((item, index) => (
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Ticket index={index} name={item.name} values={values}
                                                    flight={departure.flight} class={item.class}/>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container spacing={{xs: 1, md: 2}}
                                      style={{
                                          display: (props.activeStep == 2) ? "flex" : "none"
                                      }}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <p>Choose your payment method</p>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6}>
                                        <Button fullWidth size="large" color="inherit" variant="outlined">
                                            <PaymentIcon/>Pay with card
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6}>
                                        <Button fullWidth size="large" color="inherit" variant="outlined">
                                            <AccountBalanceIcon/> Online Banking
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )
                    }}
                </Formik>
            </StyledContent>
        </>
    )
}