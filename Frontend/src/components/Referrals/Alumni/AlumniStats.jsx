/**
 * AlumniStats component to display summary metrics of posted opportunities.
 * @param {Object} props
 * @param {Array} props.backendOpportunities - List of opportunity objects from the backend
 */
export function AlumniStats({ backendOpportunities = [] }) {
  // Backend stats
  const jobsCount = backendOpportunities.filter(opp => opp.opportunityType === 'Job').length;
  const referralsCount = backendOpportunities.filter(opp => opp.opportunityType === 'Referral' || !opp.opportunityType).length;
  const totalReferralsGiven = backendOpportunities.reduce((acc, opp) => acc + (opp.referralsGiven || 0), 0);
  const activeOpportunities = backendOpportunities?.filter(opp => opp.isActive || opp.status === 'Open').length;
  const totalReferralsPossible = backendOpportunities
    .filter(opp => opp.opportunityType === 'Referral' || !opp.opportunityType)
    .reduce((acc, opp) => acc + (opp.numberOfReferrals || 0), 0);

  // Advanced AI/Analytics stats
  const applicationsReceived = backendOpportunities.reduce((acc, opp) => acc + (opp.applicationsCount || 0), 0);
  const conversionRate = applicationsReceived > 0 
    ? ((totalReferralsGiven / applicationsReceived) * 100).toFixed(1) 
    : 0;

  return (
    <div 
      className="grid sm:grid-cols-2 lg:grid-cols-7 gap-4"
      style={{
        display: 'grid',
        gridAutoRows: '96px',
        alignItems: 'start',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      {/* Jobs Posted */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-foreground" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{jobsCount}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Jobs Posted</p>
      </div>

      {/* Referrals Posted */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-foreground" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{referralsCount}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Referrals Posted</p>
      </div>

      {/* Active Opportunities */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-foreground" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{activeOpportunities}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Active Opportunities</p>
      </div>

      {/* Applications Received */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-[var(--primary)]" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{applicationsReceived}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Applications Received</p>
      </div>

      {/* Referrals Given */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-success" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{totalReferralsGiven}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Referrals Given</p>
      </div>

      {/* Referral Conversion */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-[var(--primary)]" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{conversionRate}%</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Referral Conversion</p>
      </div>

      {/* Total Referrals Limit */}
      <div 
        className="bg-card rounded-[var(--radius-sm)] border border-border/50"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px 10px',
          boxSizing: 'border-box',
          gap: '4px',
          height: '96px',
          minHeight: '96px',
          maxHeight: '96px',
          width: '100%',
          minWidth: 0,
          alignSelf: 'start',
        }}
      >
        <p className="text-foreground" style={{ fontSize: '30px', fontWeight: '700', lineHeight: '1', textAlign: 'center', margin: 0 }}>{totalReferralsPossible}</p>
        <p className="text-muted-foreground" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.15', textAlign: 'center', width: '100%', margin: 0 }}>Total Referrals Limit</p>
      </div>
    </div>
  );
}