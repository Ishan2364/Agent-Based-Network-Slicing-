export const getPlotDescription = (title) => {
  if (!title) return '';
  const t = title.toLowerCase();
  
  if (t.includes('utility mean') || t.includes('utility')) 
    return 'Overall system utility achieved across network slices, measuring performance versus resource cost.';
  if (t.includes('rate mean') || t.includes('mean rate')) 
    return 'Average data rate achieved by users across all slices, highlighting throughput performance.';
  if (t.includes('delay mean') || t.includes('mean delay')) 
    return 'Average end-to-end delay across the network, critical for measuring latency overhead.';
  if (t.includes('fairness jain') || t.includes('jain') || t.includes('fairness')) 
    return 'Jain\'s fairness index among network slices, ensuring no single slice unfairly dominates resources.';
  if (t.includes('qos success')) 
    return 'Ratio of users that successfully meet their strict Quality of Service (QoS) requirements.';
  if (t.includes('radio util')) 
    return 'Utilization fraction of the radio access network (RAN) capacity under varying loads.';
  if (t.includes('compute util') || t.includes('comp util')) 
    return 'Utilization of edge/core compute processing resources to handle slice functions.';
  if (t.includes('transport util') || t.includes('trans util')) 
    return 'Utilization of transport network bandwidth connecting RAN to Core.';
  if (t.includes('urlcc delay')) 
    return 'End-to-end latency specifically for the URLLC (Ultra-Reliable Low Latency Communications) slice.';
  if (t.includes('urlcc violation')) 
    return 'Probability of violating the strict latency bounds for the URLLC slice, evaluated via SAA (Sample Average Approximation).';
  if (t.includes('embb rate')) 
    return 'Data rate specifically delivered to the eMBB (Enhanced Mobile Broadband) slice users.';
  if (t.includes('d comp')) 
    return 'Compute resource allocation distribution among different network slices over varying loads.';
  if (t.includes('d radio')) 
    return 'Radio spectrum/PRB (Physical Resource Block) allocation distribution across the slices.';
  if (t.includes('d trans')) 
    return 'Transport bandwidth distribution across the network slices.';
  
  return 'A performance metric evaluated across varying network loads for multiple algorithms.';
};
