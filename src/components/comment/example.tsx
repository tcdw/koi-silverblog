import { Comment } from './Comment';
import '../../styles/comment.css';

// Example usage of the Comment component
export function CommentExample() {
    return (
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6">Comment System Example</h1>
            
            <Comment
                url={window.location.pathname}
                title={document.title}
                gravatarBaseUrl="https://secure.gravatar.com/avatar/"
                jumpOffset={80}
                disableInfoSave={false}
            />
        </div>
    );
}

// For integration into existing pages
export function integrateCommentSystem() {
    // Find the target element where you want to mount the comment system
    const targetElement = document.getElementById('comment-section');
    
    if (targetElement) {
        // You would typically use your SolidJS app's render method here
        // This is just a conceptual example
        console.log('Mount comment system to:', targetElement);
    }
}
