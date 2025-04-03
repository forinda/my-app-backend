/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve a list of all departments for the organization
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of departments retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a new department
 *     description: Create a new department in the organization
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - organization_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the department
 *               description:
 *                 type: string
 *                 description: Description of the department
 *               organization_id:
 *                 type: integer
 *                 description: ID of the organization
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Department with same name already exists
 *
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     description: Retrieve a specific department by its UUID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department UUID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 *
 *   put:
 *     summary: Update department
 *     description: Update an existing department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the department
 *               description:
 *                 type: string
 *                 description: Updated description of the department
 *               organization_id:
 *                 type: integer
 *                 description: ID of the organization
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 *
 * /departments/{id}/members:
 *   get:
 *     summary: Get department members
 *     description: Retrieve all members of a specific department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department UUID
 *     responses:
 *       200:
 *         description: Department members retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 *
 * /departments/add-member/{id}:
 *   post:
 *     summary: Add users to department
 *     description: Add one or more users to a department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/octet-stream:
 *           schema:
 *             type: object
 *             required:
 *               - user_ids
 *             properties:
 *               user_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of user IDs to add to the department
 *     responses:
 *       200:
 *         description: Users added to department successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 */
