/**
 * External dependencies.
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import './style.scss';

addFilter( 'carbon-fields.media_gallery-field.block', 'carbon-fields/blocks', ( OriginalMediaGalleryField ) => ( props ) => {
	return (
		<OriginalMediaGalleryField
			buttonLabel={ __( 'Select Attachments' ) }
			mediaLibraryButtonLabel={ __( 'Use Attachments' ) }
			mediaLibraryTitle={ __( 'Select Attachments' ) }
			{ ...props }
		/>
	);
} );
