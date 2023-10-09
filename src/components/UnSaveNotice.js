import { Sync } from "./Icons";

function UnSaveNotice({ onReset }) {
	return (
		<div className="unsaved">
			<span>Not Saved</span>
			{onReset && (
				<Sync
					className="action-btn flex-center"
					onClick={onReset}
					id="sync"
					title="Reset Local changes & sync with online."
				/>
			)}
		</div>
	);
}

export default UnSaveNotice;
