
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getUserProfile } from '../_shared/apiRoutes.ts';

serve(getUserProfile);
