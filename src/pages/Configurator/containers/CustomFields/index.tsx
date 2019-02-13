import * as React from 'react';
import { connect } from 'react-redux';

interface Props {
  visualization: string;
}

class CustomFields extends React.Component<Props> {
  render() {
    return <div />;
  }
}

const mapState = ({ visualizations: { selected } }: any) => ({
  visualization: selected,
});

export default connect(mapState)(CustomFields);
