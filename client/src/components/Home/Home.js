import React, { useState, useEffect, useRef } from "react";
import { 
    Grid, 
    IconButton,
    Button,
    Typography,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Modal,
    Fade,
} from '@mui/material'
import parse from 'html-react-parser';
import dateFormat from "dateformat"
import { Editor } from '@tinymce/tinymce-react';
import Nav from "../Nav/Nav";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBoxIcon from '@mui/icons-material/AddBox';

const Home = () => {

    const [content, setContent] = useState([])
    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [showLogin, setShowLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [title, setTitle] = useState('')
    const [postContent, setPostContent] = useState('')
    const [currentId, setCurrentId] = useState(null)
    const [registrationData, setRegistrationData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const handleOpenLoginModal = () => {
        setLoginModal(true)
    }

    const handleCloseLoginModal = () => {
        setLoginModal(false)
    }

    const handleOpenRegisterModal = () => {
        setRegisterModal(true)
    }

    const handleCloseRegisterModal = () => {
        setRegisterModal(false)
    }

    const handleOpenAddModal = () => {
        setAddModal(true)
    }

    const handleCloseAddModal = () => {
        setAddModal(false)
    }

    const handleOpenDeleteModal = (postId) => {
        setCurrentId(postId)
        setDeleteModal(true)
    }

    const handleCloseDeleteModal = () => {
        setCurrentId(null)
        setDeleteModal(false)
    }

    const userLogin = () => {
        fetch(`http://localhost:5000/api/v1/auth`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('token', data.token)
            setName(data.name)
            setShowLogin(false)
            setIsLoggedIn(true)
            handleCloseLoginModal()
        })
    }

    const userRegister = () => {
        fetch(`http://localhost:5000/api/v1/users/register`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                firstName: registrationData.firstName, 
                lastName: registrationData.lastName, 
                email: registrationData.email, 
                password: registrationData.password 
            })
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('token', data.token)
            setName(data.name)
            setShowLogin(false)
            setIsLoggedIn(true)
            handleCloseRegisterModal()
        })
    }

    const getContent = () => {
        fetch(`http://localhost:5000/api/v1/posts`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            setContent(data)
        })
    }

    const getContentById = (postId) => {
        setCurrentId(postId)
        fetch(`http://localhost:5000/api/v1/posts/${postId}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setTitle(data.post.title)
            setPostContent(data.post.content)
            handleOpenAddModal()
        })
    }

    const deleteContentById = () => {
        fetch(`http://localhost:5000/api/v1/posts/${currentId}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            getContent();
            handleCloseDeleteModal();
        })
    }

    const editorRef = useRef(null);

    const submitContent = () => {
        if (currentId) {
            fetch(`http://localhost:5000/api/v1/posts/${currentId}`, {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    title: title,
                    content: editorRef.current.getContent()
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                getContent();
                setTitle('')
                setPostContent('')
                setCurrentId(null)
                handleCloseAddModal();
            })
        } else {
            fetch(`http://localhost:5000/api/v1/posts`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    title: title,
                    content: editorRef.current.getContent()
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                getContent();
                setTitle('')
                setPostContent('')
                handleCloseAddModal();
            })
        }
    }


    const addModalBody = (
        <div style={{ background: "white", maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '10vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        defaultValue={title}
                        onChange={(e) => {setTitle(e.target.value)}}
                    />
                </Grid>
                <Grid item xs={12}>
                <Editor
                    apiKey='jb8rnhmlayy7m4eu40xfzjkcnmemxihj0t3q92i5lnd7vh29'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={postContent}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={submitContent} variant="contained" fullWidth >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </div>
    )

    const deleteModalBody = (
        <div style={{ textAlign: 'center', background: "white", maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography>
                        Are you sure you want to delete this content?
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Button variant='outlined' onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant='contained' onClick={deleteContentById}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </div>
    )

    const registerModalBody = (
        <div style={{ background: "white", maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        label="Email"
                        defaultValue={email}
                        onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        type='password'
                        label="Password"
                        defaultValue={password}
                        onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        label="First Name"
                        defaultValue={password}
                        onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        defaultValue={password}
                        onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Button onClick={userRegister} variant="contained" fullWidth >
                        Register
                    </Button>
                </Grid>
                <span onClick={() => { handleCloseRegisterModal(); handleOpenLoginModal() }} style={{ cursor: 'pointer', marginTop: 10 }}>Already have an account? Login here</span>
            </Grid>
        </div>
    )

    const loginModalBody = (
        <div style={{ background: "white", maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, padding: 20, marginTop: '20vh',}}>
            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        label="Email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={7}>
                    <TextField
                        fullWidth
                        type='password'
                        label="Password"
                        defaultValue={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={7}>
                    <Button onClick={userLogin} variant="contained" fullWidth >
                        Login
                    </Button>
                </Grid>
                <span onClick={() => { handleCloseLoginModal(); handleOpenRegisterModal() }} style={{ cursor: 'pointer', marginTop: 10 }}>Don't have an account? Register here</span>
            </Grid>
        </div>
    )

    useEffect(() => {
        getContent()
    }, [])

    return (
        <div>
            <Nav name={name} showLogin={showLogin} openLogin={handleOpenLoginModal} />
            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 50 }}>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={loginModal}
                            onClose={handleCloseLoginModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={loginModal}>
                                {loginModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={addModal}
                            onClose={handleCloseAddModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={addModal}>
                                {addModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={deleteModal}
                            onClose={handleCloseDeleteModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={deleteModal}>
                                {deleteModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                <Grid item xs={12} align="center">
                    <div>
                        <Modal
                            open={registerModal}
                            onClose={handleCloseRegisterModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            closeAfterTransition
                        >
                            <Fade in={registerModal}>
                                {registerModalBody}
                            </Fade>
                        </Modal>
                    </div>
                </Grid>
                {isLoggedIn && 
                    <Grid item xs={7}>
                        <Button onClick={handleOpenAddModal} variant="contained" startIcon={<AddBoxIcon />}>
                            Add Content
                        </Button>
                    </Grid>
                }
                {content.length > 0 &&
                    content.map((row, i) => {
                        return (
                            <Grid key={i} item xs={7}>
                                <Card style={{ padding: 20 }}>
                                    <CardHeader 
                                        title={row.title} 
                                        subheader={dateFormat(row.updatedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
                                        action={
                                            <div>
                                                {isLoggedIn && 
                                                <IconButton onClick={() => getContentById(row._id)}>
                                                    <EditIcon />
                                                </IconButton>}
                                                {isLoggedIn && 
                                                <IconButton onClick={() => handleOpenDeleteModal(row._id)}>
                                                    <DeleteForeverIcon />
                                                </IconButton>}
                                            </div>
                                        }
                                    />
                                    <CardContent>
                                        {parse(row.content)}
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    )
}

export default Home;