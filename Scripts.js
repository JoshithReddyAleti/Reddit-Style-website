let posts = [];
let users = [];
let subreddits = [
    { id: 'r1', name: 'Funny', subscribers: 100 },
    { id: 'r2', name: 'Technology', subscribers: 200 },
    { id: 'r3', name: 'Science', subscribers: 150 },
    { id: 'r4', name: 'Love', subscribers: 1500 },
    { id: 'r5', name: 'Games', subscribers: 160 }
];

let subredditPosts = {
    'r1': [],
    'r2': [],
    'r3': [],
    'r4': [],
    'r5': []
};

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter both username and password!');
        return;
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        alert('Username already exists. Please choose another.');
        return;
    }

    const newUser = {
        id: generateId(),
        username: username,
        password: password,
        subscriptions: [],
        upvotes_received: []
    };
    users.push(newUser);

    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('post-form').classList.remove('hidden');
    alert('User registered successfully!');
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        alert('Invalid username or password!');
        return;
    }

    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('post-form').classList.remove('hidden');
    alert('Logged in successfully!');
}

function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const subredditId = document.getElementById('subreddit').value;

    if (!title || !content || !subredditId) {
        alert('Please fill out all fields!');
        return;
    }

    const newPost = {
        id: generateId(),
        title: title,
        content: content,
        subredditId: subredditId,
        upvotes: 0,
        comments: [],
        timestamp: new Date().toISOString()
    };
    posts.push(newPost);
    subredditPosts[subredditId].push(newPost);

    displayPosts(subredditId);
    alert('Post created successfully!');
}

function displayPosts(subredditId) {
    const postContainer = document.getElementById('posts');
    postContainer.innerHTML = '';

    const subreddit = subredditPosts[subredditId] || [];
    subreddit.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="timestamp">Posted on ${new Date(post.timestamp).toLocaleString()}</div>
            <button onclick="upvotePost('${post.id}')">Upvote</button> <span>${post.upvotes} upvotes</span>
            <div class="comments">
                ${post.comments.map(comment => `
                    <div class="comment">
                        <p>${comment.content}</p>
                        <div class="timestamp">Commented on ${new Date(comment.timestamp).toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
            <div class="comment-form">
                <input type="text" placeholder="Add a comment" id="comment-${post.id}">
                <button onclick="addComment('${post.id}')">Comment</button>
            </div>
        `;
        postContainer.appendChild(postElement);
    });
}

function upvotePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.upvotes += 1;
        displayPosts(post.subredditId);
    }
}

function addComment(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const commentInput = document.getElementById(`comment-${postId}`);
        const commentContent = commentInput.value;

        if (!commentContent) {
            alert('Please enter a comment!');
            return;
        }

        const newComment = {
            id: generateId(),
            content: commentContent,
            timestamp: new Date().toISOString()
        };
        post.comments.push(newComment);
        commentInput.value = '';

        displayPosts(post.subredditId);
    }
}

function showRegisterForm() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Initial load
function loadSubreddits() {
    const subredditList = document.getElementById('subreddit-list');
    const subredditSelect = document.getElementById('subreddit');

    subreddits.forEach(subreddit => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#" onclick="displayPosts('${subreddit.id}')">${subreddit.name}</a>`;
        subredditList.appendChild(listItem);

        const option = document.createElement('option');
        option.value = subreddit.id;
        option.textContent = subreddit.name;
        subredditSelect.appendChild(option);
    });
}

window.onload = loadSubreddits;