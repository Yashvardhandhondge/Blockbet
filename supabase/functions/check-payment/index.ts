
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { checkPaymentStatus } from '../_shared/apiRoutes.ts';

serve(checkPaymentStatus);
