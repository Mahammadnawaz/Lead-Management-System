import Lead, { LEAD_STATUSES } from '../models/Lead.js';

/**
 * @route   GET /api/analytics/metrics
 * @desc    Get aggregated dashboard metrics and status distribution for visualization
 * @access  Private
 */
export const getDashboardMetrics = async (req, res, next) => {
  try {
    // 1. Group leads by status
    const statusCountsAggregate = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format map ensuring all 5 standard statuses exist even if count is 0
    const countsMap = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0,
    };

    let totalLeads = 0;
    statusCountsAggregate.forEach((item) => {
      if (countsMap.hasOwnProperty(item._id)) {
        countsMap[item._id] = item.count;
      }
      totalLeads += item.count;
    });

    // 2. Status distribution array formatted for Recharts
    const statusColors = {
      New: '#3B82F6',
      Contacted: '#F59E0B',
      Qualified: '#8B5CF6',
      Converted: '#10B981',
      Lost: '#EF4444',
    };

    const statusDistribution = LEAD_STATUSES.map((status) => ({
      status,
      count: countsMap[status],
      color: statusColors[status],
    }));

    // 3. Conversion Rate calculation
    const conversionRate = totalLeads > 0 
      ? ((countsMap.Converted / totalLeads) * 100).toFixed(1) 
      : '0.0';

    // 4. Monthly acquisition trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrendAggregate = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          leads: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = monthlyTrendAggregate.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      leads: item.leads,
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalLeads,
          newLeads: countsMap.New,
          contactedLeads: countsMap.Contacted,
          qualifiedLeads: countsMap.Qualified,
          convertedLeads: countsMap.Converted,
          lostLeads: countsMap.Lost,
          conversionRate: `${conversionRate}%`,
        },
        statusDistribution,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};
