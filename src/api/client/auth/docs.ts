/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         phone_number:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *
 *     SessionResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *
 *     UpdateProfileResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         message:
 *           type: string
 *         status:
 *           type: integer
 *
 *     SwitchOrganizationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: integer
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email/username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - password
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 description: User's email, phone number, or username
 *               password:
 *                 type: string
 *                 description: User's password
 *               rememberMe:
 *                 type: boolean
 *                 description: Whether to remember the user's session
 *                 default: false
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Unauthorized
 *
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - username
 *               - password
 *               - phone_number
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 default: Other
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 *
 * /auth/session:
 *   get:
 *     summary: Get current session
 *     description: Retrieve the current user's session information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       401:
 *         description: Unauthorized
 *
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the current user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - first_name
 *               - last_name
 *               - email
 *               - username
 *               - phone_number
 *             properties:
 *               user_id:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               phone_number:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProfileResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *
 * /auth/switch-organization:
 *   post:
 *     summary: Switch current organization
 *     description: Switch the user's current organization context
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - organization_id
 *             properties:
 *               organization_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization switched successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               $ref: '#/components/schemas/SwitchOrganizationResponse'
 *       400:
 *         description: Invalid organization ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User not a member of the organization
 */
