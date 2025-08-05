const transformCampaign = (campaign) => {
  const campaignObj = campaign.toObject?.() || campaign;

  return {
    ...campaignObj,
    nodes: (campaignObj.nodes || []).map(
      ({ _id, events, branches, ...nodeRest }) => ({
        ...nodeRest,
        events: (events || []).map(({ _id, ...eventRest }) => eventRest),
        branches: (branches || []).map(({ _id, ...branchRest }) => branchRest),
      })
    ),
  };
};

module.exports = transformCampaign;
