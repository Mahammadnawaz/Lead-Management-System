import Lead from '../models/Lead.js';

/**
 * @route   GET /api/leads
 * @desc    Get leads with search, filter, and pagination
 * @access  Private
 */
export const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    // Filter by Lead Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by name, email, phone, or company
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { company: searchRegex },
        { serviceInterested: searchRegex },
      ];
    }

    // Date range filter on createdAt
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [leads, totalLeads] = await Promise.all([
      Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email'),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalLeads / limit) || 1;

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          totalLeads,
          page,
          limit,
          totalPages,
          hasPrevPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/leads/:id
 * @desc    Get a single lead by ID
 * @access  Private
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/leads
 * @desc    Create a new lead
 * @access  Private
 */
export const createLead = async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      createdBy: req.user._id,
      assignedTo: req.body.assignedTo || req.user._id,
    };

    const lead = await Lead.create(leadData);
    await lead.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/leads/:id
 * @desc    Update an existing lead
 * @access  Private
 */
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: { lead: updatedLead },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 * @access  Private
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
