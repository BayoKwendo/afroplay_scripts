import { Router } from 'https://deno.land/x/oak/mod.ts';
import livestockController from '../controllers/livestockController.ts';
import { upload, preUploadValidate } from 'https://deno.land/x/oak_upload_middleware@3.0/mod.ts';
import authorize from '../middlewares/authorizedmiddle.ts';

const router = new Router();

router
	// .post(
	// 	'/livestock',
	// 	upload('uploads', {
	// 		extensions: [ 'jpg', 'png' ],
	// 		saveFile: true,
	// 		readFile: true,
	// 		useCurrentDir: true,
	// 		useDateTimeSubDir: true,
	// 	}),
	// 	livestockController.createLivestock
	// )
	.post(
		'/upload',
		upload('uploads', { extensions: [ 'jpg', 'png' ], maxSizeBytes: 200000000000, maxFileSizeBytes: 100000000000 }),
		async (context: any) => {
			context.response.body = context.uploadedFiles;
		}
	)
	
	.post('/livestock', authorize, livestockController.createLivestock)
	.get('/livestock', authorize, livestockController.getLivestock)
	.get('/livestock_loans', authorize, livestockController.getLivestockLoans)
	.put('/livestock', authorize, livestockController.editLivestock)
	.put('/livestock_document', authorize, livestockController.updateLivestock)
	.put('/livestock_update_value', authorize, livestockController.updateNgombeValue)

	.get('/rejected_loans', authorize, livestockController.getRejectedLoans)
	.post('/updated_rejected', authorize, livestockController.updateRejectedLoans)

	.post('/updated_rejected_variete', authorize, livestockController.updateRejectedVariete)
	.delete('/livestock', authorize, livestockController.deleteLivestock);

export default router;
