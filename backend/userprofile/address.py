from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .pincode import fetch_pincode_info
import requests

class PincodeInfoView(APIView):
    def get(self, request):
        pincode = request.query_params.get('pincode')
        if not pincode:
            return Response(
                {"error": "Missing 'pincode' query parameter."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            data = fetch_pincode_info(pincode)
            return Response(data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response(
                {"error": "Failed to fetch pincode info", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
