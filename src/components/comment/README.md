# SolidJS Comment System

This is a SolidJS implementation of the Pomment comment system, converted from the original Vue 3 version. It provides a complete comment widget with threaded conversations, user management, and modern UI.

## Features

- **Threaded Comments**: Support for nested replies with proper tree structure
- **User Information Storage**: Remembers user details across sessions (optional)
- **Avatar Support**: Gravatar integration with fallback to identicon
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic adaptation to dark/light themes
- **Real-time Updates**: Comments appear immediately after submission
- **Loading States**: Proper loading and error handling
- **Form Validation**: Client-side validation for required fields
- **Accessibility**: Semantic HTML and keyboard navigation support

## File Structure

```
src/components/comment/
├── Comment.tsx              # Main comment widget component
├── CommentForm.tsx          # Comment submission form
├── CommentGroup.tsx         # Container for comment threads
├── CommentItem.tsx          # Individual comment display
├── CommentInput.tsx         # Form input component
├── CommentTextarea.tsx      # Form textarea component
├── CommentFormItem.tsx      # Form field wrapper
├── CommentDateTime.tsx      # Date/time display component
├── example.tsx              # Usage examples
├── index.ts                 # Component exports
└── README.md               # This file

src/utils/
├── build-tree.ts           # Comment tree building utilities
├── format.ts               # Date and avatar formatting
└── storage.ts              # Local storage utilities

src/styles/
└── comment.css             # Comment system styles

src/api/
└── comment.ts              # API integration

src/types/
└── comment.ts              # TypeScript type definitions
```

## Usage

### Basic Usage

```tsx
import { Comment } from "./components/comment";
import "./styles/comment.css";

function MyPage() {
  return (
    <div>
      <h1>My Blog Post</h1>
      <p>Content here...</p>

      <Comment url={window.location.pathname} title={document.title} />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { Comment } from "./components/comment";
import "./styles/comment.css";

function MyPage() {
  return (
    <Comment
      url="/blog/my-post"
      title="My Blog Post Title"
      gravatarBaseUrl="https://secure.gravatar.com/avatar/"
      jumpOffset={80}
      disableInfoSave={false}
    />
  );
}
```

## Props

### Comment Component Props

| Prop              | Type      | Default                                 | Description                                    |
| ----------------- | --------- | --------------------------------------- | ---------------------------------------------- |
| `url`             | `string`  | **Required**                            | Unique identifier for the comment thread       |
| `title`           | `string`  | `document.title`                        | Page title for the comment thread              |
| `gravatarBaseUrl` | `string`  | `'https://secure.gravatar.com/avatar/'` | Base URL for Gravatar avatars                  |
| `jumpOffset`      | `number`  | `0`                                     | Offset for smooth scrolling to parent comments |
| `disableInfoSave` | `boolean` | `false`                                 | Disable saving user info to localStorage       |

## API Integration

The comment system expects these API endpoints:

### GET/POST `/public/posts/byUrl`

Fetch comments for a specific URL.

**Request:**

```json
{
  "url": "/blog/my-post"
}
```

**Response:**

```json
{
  "meta": {
    "title": "My Blog Post",
    "firstPostAt": 1640995200,
    "latestPostAt": 1640995200,
    "amount": 5,
    "id": "thread-id",
    "locked": false,
    "url": "/blog/my-post"
  },
  "post": [
    {
      "id": "comment-1",
      "name": "John Doe",
      "emailHashed": "hash123",
      "website": "https://johndoe.com",
      "parent": "",
      "content": "Great post!",
      "hidden": false,
      "byAdmin": false,
      "createdAt": 1640995200,
      "updatedAt": 1640995200,
      "avatar": ""
    }
  ]
}
```

### POST `/public/posts/add`

Submit a new comment.

**Request:**

```json
{
  "url": "/blog/my-post",
  "title": "My Blog Post",
  "name": "John Doe",
  "email": "john@example.com",
  "website": "https://johndoe.com",
  "content": "This is my comment",
  "receiveEmail": true,
  "parent": "comment-1"
}
```

**Response:**

```json
{
  "id": "comment-2",
  "name": "John Doe",
  "emailHashed": "hash123",
  "website": "https://johndoe.com",
  "parent": "comment-1",
  "content": "This is my comment",
  "hidden": false,
  "byAdmin": false,
  "createdAt": 1640995260,
  "updatedAt": 1640995260,
  "avatar": ""
}
```

## Styling

The comment system includes comprehensive CSS styles in `src/styles/comment.css`. The styles support:

- Light and dark themes (using `.dark` class)
- Responsive design for mobile devices
- Modern UI with smooth transitions
- Accessible form controls
- Proper typography and spacing

### Customization

You can customize the appearance by overriding CSS variables or classes:

```css
.pomment-widget {
  --primary-color: #your-color;
  --border-radius: 8px;
  --spacing: 20px;
}
```

## Differences from Vue 3 Version

### Architectural Changes

- **Reactivity**: Uses SolidJS signals instead of Vue's reactivity system
- **Component Structure**: Functional components instead of Vue SFC format
- **State Management**: Local state with signals instead of Vue's ref/reactive
- **Event Handling**: SolidJS event handlers instead of Vue's @event syntax

### Feature Parity

- ✅ Comment loading and display
- ✅ Threaded replies
- ✅ Form submission and validation
- ✅ User information persistence
- ✅ Avatar display with Gravatar
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading and error states
- ✅ Smooth scrolling to parent comments

### Missing Features (from Vue version)

- reCAPTCHA integration (can be added if needed)
- Custom event handlers for submit success/error (simplified to props)
- Shadow DOM support (not typically needed in SolidJS)

## Browser Support

- Modern browsers with ES2017+ support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Dependencies

- SolidJS
- ofetch (for API calls)
- Modern browser with localStorage support

## Development

To extend or modify the comment system:

1. **Adding new features**: Create new components in the `comment/` directory
2. **Styling changes**: Modify `src/styles/comment.css`
3. **API changes**: Update `src/api/comment.ts` and type definitions
4. **Utility functions**: Add to appropriate files in `src/utils/`

## Migration from Vue 3

If you're migrating from the Vue 3 version:

1. Replace Vue component imports with SolidJS components
2. Update your build system to handle SolidJS
3. Include the CSS file in your bundle
4. Update any custom event handlers to use the new prop-based system
5. Test thoroughly as the reactivity system works differently

## License

This implementation maintains compatibility with the original Pomment license.
