// Initialize Supabase client
const supabaseUrl = 'https://aptoznhspgqqqgvzrirh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdG96bmhzcGdxcXFndnpyaXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2ODEyMjEsImV4cCI6MjA2ODI1NzIyMX0.X-GXgOQK66iTbkLDb4OkQbpnvZzUaEBDhl8yJLahLxA'
const supabase = createClient(supabaseUrl, supabaseKey)

let currentBlogId = null;

// Fetch and render blog posts
async function loadBlogs() {
    try {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const blogGrid = document.getElementById('blogGrid');
        blogGrid.innerHTML = '';

        blogs.forEach(blog => {
            const card = createBlogCard(blog);
            blogGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

// Create blog card element
function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-id', blog.id);
    
    card.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.excerpt || blog.content.substring(0, 150)}...</p>
        <div class="blog-meta">
            <span class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</span>
            <span class="blog-comments-count">
                <i class="fas fa-comment"></i>
                <span class="count">0</span>
            </span>
        </div>
    `;

    // Load comment count
    loadCommentCount(blog.id).then(count => {
        card.querySelector('.count').textContent = count;
    });

    // Add click event to open modal
    card.addEventListener('click', () => openBlogModal(blog));

    return card;
}

// Open blog modal
function openBlogModal(blog) {
    currentBlogId = blog.id;
    const modal = document.getElementById('blogModal');
    
    modal.querySelector('.blog-title').textContent = blog.title;
    modal.querySelector('.blog-date').textContent = new Date(blog.created_at).toLocaleDateString();
    modal.querySelector('.blog-content').innerHTML = blog.content;

    loadComments(blog.id);
    modal.style.display = 'block';
}

// Load comments for a blog post
async function loadComments(blogId) {
    try {
        const { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('blog_id', blogId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const commentsList = document.querySelector('.comments-list');
        commentsList.innerHTML = '';

        comments.forEach(comment => {
            const commentElement = createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Create comment element
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.innerHTML = `
        <div class="comment-header">
            <span class="commenter-name">${comment.name}</span>
            <span class="comment-date">${new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <div class="comment-text">${comment.content}</div>
    `;
    return div;
}

// Get comment count for a blog
async function loadCommentCount(blogId) {
    try {
        const { count, error } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('blog_id', blogId);

        if (error) throw error;
        return count;
    } catch (error) {
        console.error('Error loading comment count:', error);
        return 0;
    }
}

// Handle comment form submission
async function submitComment(name, content) {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    blog_id: currentBlogId,
                    name: name,
                    content: content,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        // Reload comments and update count
        await loadComments(currentBlogId);
        const count = await loadCommentCount(currentBlogId);
        const countElement = document.querySelector(`.blog-card[data-id="${currentBlogId}"] .count`);
        if (countElement) countElement.textContent = count;

        // Close comment modal and ensure blog modal stays open
        document.getElementById('commentModal').style.display = 'none';
        document.getElementById('blogModal').style.display = 'block';

        return true;
    } catch (error) {
        console.error('Error submitting comment:', error);
        return false;
    }
}

// Event Listeners
// Load blogs immediately
loadBlogs();

document.addEventListener('DOMContentLoaded', () => {
    // Reload blogs when DOM is ready
    loadBlogs();

    // Close modals when clicking the close button or outside
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Open comment modal
    document.querySelector('.add-comment-btn').addEventListener('click', () => {
        document.getElementById('commentModal').style.display = 'block';
    });

    // Handle comment form submission
    document.getElementById('commentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('commenterName').value;
        const content = document.getElementById('commentText').value;

        if (await submitComment(name, content)) {
            document.getElementById('commentForm').reset();
            document.getElementById('commentModal').style.display = 'none';
        }
    });
});
