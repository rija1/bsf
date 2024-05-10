import {Component} from '@wordpress/element'

export class SilentErrorBoundary extends Component {

    constructor(props) {
        super(props);
        this.state = {hasError: false, msg: ''};
    }

    static getDerivedStateFromError(error) {
        let msg = error?.message || error;
        return {hasError: true, msg};
    }

    render() {
        if (this.state.hasError) {
            if (this.props.showError) {
                return (
                    <>
                        <div className={'wc-stripe-error-message'}>
                            {this.state.msg}
                        </div>
                    </>
                )
            }
            return null;
        }
        return this.props.children;
    }
}